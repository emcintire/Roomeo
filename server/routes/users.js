const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const upload = require('../startup/multer')();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const {
    User,
    schema,
    updateSchema,
    getIdFromToken,
} = require('../models/user');

router.get('/', express.static(path.join(__dirname, '../public')));

router.post('/img', upload.single('file'), (req, res) => {
    const id = '6056928c143b00f109609135';
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, './uploads/image.png');

    fs.rename(tempPath, targetPath, async (err) => {
        const user = await User.findById(id);

        const obj = {
            priority: user.imgs.length,
            path: tempPath,
        };

        User.findByIdAndUpdate(
            user._id,
            { $push: { imgs: obj } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            }
        );

        res.status(200).contentType('text/plain').end('File uploaded!');
    });
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

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
    res.header('x-auth-token', token).send(
        _.pick(user, ['_id', 'name', 'email'])
    );
});

router.delete('/', auth, async (req, res) => {
    //Deletes the user with the given id
    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findByIdAndRemove(id);

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

router.get('/:id', validateObjectId, async (req, res) => {
    //Returns the user with the given id
    const user = await User.findById(req.params.id);

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

router.put('/updateEmail', auth, async (req, res) => {
    //Updates the email of the logged in user
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findByIdAndUpdate(
        id,
        { email: req.body.email },
        {
            new: true,
        }
    );

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

router.put('/updateName', auth, async (req, res) => {
    //Updates the name of the logged in user
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findByIdAndUpdate(
        id,
        { name: req.body.name },
        {
            new: true,
        }
    );

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

router.put('/updateBio', auth, async (req, res) => {
    //Updates the bio of the logged in user
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findByIdAndUpdate(
        id,
        { bio: req.body.bio },
        {
            new: true,
        }
    );

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

router.put('/updateGender', auth, async (req, res) => {
    //Updates the gender of the logged in user
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findByIdAndUpdate(
        id,
        { gender: req.body.gender },
        {
            new: true,
        }
    );

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

router.put('/updateAge', auth, async (req, res) => {
    //Updates the age of the logged in user
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findByIdAndUpdate(
        id,
        { age: req.body.age },
        {
            new: true,
        }
    );

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

router.put('/updateInterests', auth, async (req, res) => {
    //Updates the interests of the logged in user
    const id = getIdFromToken(req.header('x-auth-token'));

    //Clears the interests array
    await User.findByIdAndUpdate(
        id, 
        { interests: new Array()},
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        }
    );

    const user = await User.findByIdAndUpdate(
        id,
        { $addToSet: { interests : { $each: req.body.interests }}},
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        }
    );

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

router.put('/updatePassword', auth, async (req, res) => {
    //Updates the password of the logged in user
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Hashes the users password for security
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const id = getIdFromToken(req.header('x-auth-token'));
    const user = await User.findByIdAndUpdate(
        id,
        { password: newPassword },
        {
            new: true,
        }
    );

    if (!user)
        return res
            .status(404)
            .send('The user with the given ID was not found.');

    res.send(user);
});

module.exports = router;
