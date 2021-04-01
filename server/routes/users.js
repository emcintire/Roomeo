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

// router.get('/', express.static(path.join(__dirname, '../public')));

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

router.delete('/', auth, async (req, res) => {
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

router.post('/img', upload.single('file'), (req, res) => {
    const id = getIdFromToken(req.header('x-auth-token'));
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, './uploads/image.png');

    fs.rename(tempPath, targetPath, async (err) => {
        let user = await User.findById(id);

        const obj = {
            priority: user.imgs.length,
            path: tempPath,
        };

        user = User.findByIdAndUpdate(
            id,
            { $push: { imgs: obj } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            }
        );

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
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = getIdFromToken(req.header('x-auth-token'));
    
    //Hashes the users password for security
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(
        id,
        { 
            email: req.body.email,
            password: newPassword, 
        },
        {
            new: true,
        }
    );

    if (!user)
    return res
        .status(404)
        .send('The user with the given ID was not found.');

    res.status(200).send();
});

router.get('/updateFilters', auth, async (req, res) => {
    //Finds the users that meet the filter requirements
    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findById(id);

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    const query = {
        _id: { $ne: id },
        location: {
            //Find users within radius
            $geoWithin: {
                $centerSphere: [
                    user.location.coordinates,
                    milesToRadian(req.body.distance),
                ],
            },
        },
        age: {
            $gte: req.body.minAge,
            $lte: req.body.maxAge,
        },
        gender: { $in: req.body.gender },
        interests: { $all: req.body.interests },
    };

    const results = await User.find(query);
    res.status(200).send(results);
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

        //Remove the liked user from the other users likes array
        user2.likes = user2.likes.remove_by_value(id);
    } else {
        //If user2 doesnt like user1 add user2's id to user1's likes array
        user1.likes.push(user2._id);
    }

    user1.save();
    user2.save();

    res.status(200).send();
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

module.exports = router;
