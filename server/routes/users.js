const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const path = require('path');
const nodegeocoder = require('node-geocoder');
const fs = require('fs');
const upload = require('../startup/multer')();
const auth = require('../middleware/auth');
const async = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');
const {
    User,
    schema,
    updateSchema,
    getIdFromToken,
    milesToRadian,
} = require('../models/user');
const { send } = require('process');

router.post('/', async (req, res) => {
    //Creates a user with the properties: name, email, password
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10); //Hash the password
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.send(token);
});

router.delete('/deleteAccount', auth, async (req, res) => {
    //Deletes the user with the given id
    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findByIdAndRemove(id);

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.status(200).send();
});

router.post('/getUserData', async (req, res) => {
    const id = getIdFromToken(req.body.userToken);
    const user = await User.findById(id);

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.status(200).send(user);
});

router.post('/getUserDataWithId', async (req, res) => {
    const user = await User.findById(req.body.id);

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.status(200).send(user);
});


router.post('/img', upload.single('file'), (req, res) => {
    const id = getIdFromToken(req.header('x-auth-token'));
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, './uploads/image.png');

    fs.rename(tempPath, targetPath, async (err) => {
        const user = await User.findByIdAndUpdate(id, {
            img: tempPath.slice(22),
        });

        if (!user)
            return res
                .status(404)
                .send('The user with the given ID was not found.');

        res.status(200).send();
    });
});

router.put('/updateProfile', auth, async (req, res) => {
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = getIdFromToken(req.header('x-auth-token'));

    let user = await User.findByIdAndUpdate(id, {
        $set: _.omit(req.body, req.body.address),
    });

    if (req.body.address) {
        //Updates the location of the logged in user
        const options = {
            provider: 'mapquest',
            httpAdapter: 'https',
            apiKey: 'HEEOmggzJMuZBvhQTMzHg5NzjAeBaIvo',
        };

        //Converts address string to coordinates
        const geocoder = nodegeocoder(options);
        const result = await geocoder.geocode(req.body.address, function (err) {
            if (err) {
                res.send(err);
            }
        });
        const coords = [result[0].longitude, result[0].latitude];

        user = await User.findByIdAndUpdate(id, {
            location: {
                type: 'Point',
                address: result[0].formattedAddress,
                coordinates: coords,
                index: '2d',
            },
        });
    }

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.status(200).send();
});

router.put('/updateAccount', auth, async (req, res) => {
    // const { error } = updateSchema.validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const id = getIdFromToken(req.header('x-auth-token'));
    let user = await User.findById(id);

    if (req.body.oldPassword) {
        const validPassword = await bcrypt.compare(
            req.body.oldPassword,
            user.password
        );
        if (!validPassword)
            return res.status(400).send('Invalid email or password');

        //Hashes the users password for security
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.newPassword, salt);

        user = await User.findByIdAndUpdate(
            id,
            {
                email: req.body.email,
                password: newPassword,
            },
            {
                new: true,
            }
        );
    } else {
        user = await User.findByIdAndUpdate(
            id,
            {
                email: req.body.email,
            },
            {
                new: true,
            }
        );
    }

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.status(200).send();
});

router.post('/getUsers', auth, async (req, res) => {
    //Finds the users that meet the filter requirements
    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findById(id);

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    let wantedGender = [];

    switch (req.body.gender) {
        case 'Everyone': 
            wantedGender = ['Male', 'Female', 'Other'];
            break;
        case 'Men':
            wantedGender = ['Male'];
            break;
        case 'Women':
            wantedGender = ['Female'];
            break;
    }

    const query = {
        $and: [
            {
                $and: [
                    { _id: { $ne: id } },
                    { _id: { $nin: user.dislikes } },
                    { _id: { $nin: user.likes } },
                ],
            },
            {
                location: {
                    //Find users within radius
                    $geoWithin: {
                        $centerSphere: [
                            user.location.coordinates,
                            milesToRadian(req.body.distance),
                        ],
                    },
                },
            },
            {
                age: {
                    $gte: req.body.ageRange[0],
                    $lte: req.body.ageRange[1],
                },
            },
            { gender: { $in: wantedGender } },
            // { interests: { $all: req.body.interests } } ,
            // { interests: { $in: req.body.interests } },
        ],
    };

    const results = await User.find(query);
    res.status(200).send(results);
});

router.put('/updateFilters', auth, async (req, res) => {
    //Updates the users filters for finding other users
    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findById(id);

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    user.filters = req.body;
    user.save();

    res.status(200).send();
});

router.post('/like', auth, async (req, res) => {
    //Like button functionality for finding other users
    const id = getIdFromToken(req.header('x-auth-token'));
    const user1 = await User.findById(id);
    const user2 = await User.findById(req.body.id);

    if (!user1 || !user2)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    if (user2.likes.includes(user1._id)) {
        //If user2 likes user1 add the users id to both users matches array
        user1.matches.push(user2._id);
        user2.matches.push(user1._id);
        user1.likes.push(user2._id);

        let match1 = user1.matches.find((item) => item._id == user2._id);
        let match2 = user2.matches.find((item) => item._id == user1._id);

        match1.name = user2.name;
        match2.name = user1.name;
        match1.img = user2.img;
        match2.img = user1.img;
        
        user1.save();
        user2.save();

        res.status(200).send(user2._id);
    } else {
        //If user2 doesnt like user1 add user2's id to user1's likes array
        user1.likes.push(user2._id);
        user1.save();

        res.status(200).send();
    }
});

router.post('/dislike', auth, async (req, res) => {
    //Adds user2's id to user1's dislikes array
    const id = getIdFromToken(req.header('x-auth-token'));
    const user1 = await User.findById(id);
    const user2 = await User.findById(req.body.id);

    if (!user1 || !user2)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    user1.dislikes.push(user2._id);
    user1.save();

    res.status(200).send();
});

router.post('/unmatch', auth, async (req, res) => {
    //Removes user2 from user1's matches array
    const id = getIdFromToken(req.header('x-auth-token'));
    const user1 = await User.findById(id);
    const user2 = await User.findById(req.body.id);

    if (!user1 || !user2)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    user1.matches.remove(user2._id);
    user2.matches.remove(user1._id);

    user1.dislikes.push(user2._id);
    user2.dislikes.push(user1._id);

    user1.save();
    user2.save();

    res.status(200).send();
});

router.post('/sendMessage', auth, async (req, res) => {
    //Sends a message from logged in user1 to matched user2
    const id = getIdFromToken(req.header('x-auth-token'));
    const user1 = await User.findById(id);
    const user2 = await User.findById(req.body.id);

    if (!user1 || !user2)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    //Adds the message to the user1's messages array
    user1.matches
        .find((item) => item._id == req.body.id)
        .messages.push({
            content: req.body.message,
            u_id: id,
        });

    //Adds the message to the user2's messages array
    user2.matches
        .find((item) => item._id == id)
        .messages.push({
            content: req.body.message,
            u_id: id,
        });

    user1.save();
    user2.save();

    res.status(200).send();
});

module.exports = router;
