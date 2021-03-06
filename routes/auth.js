const jwt = require('jsonwebtoken');
const config = require('config');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require("joi");
const {User} = require('../models/user');

router.post("/", async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

const schema = Joi.object({
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).required()
});

module.exports = router;
