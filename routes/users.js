const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, schema } = require("../models/user");
const validateObjectId = require('../middleware/validateObjectId');


// router.get("/me", auth, async (req, res) => {
//     const user = await User.findById(req.user._id).select('-password');
//     res.send(user);
// });

router.post("/", async (req, res) => {
    //Create a user with properties: name, email, password

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete("/:id", [auth, admin], async (req, res) => {
    //Delete a user with the given id

    const user = await User.findByIdAndRemove(req.params.id);

    if (!user)
        return res
            .status(404)
            .send("The user with the given ID was not found.");

    res.send(user);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
        return res
            .status(404)
            .send("The genre with the given ID was not found.");

    res.send(genre);
});

module.exports = router;