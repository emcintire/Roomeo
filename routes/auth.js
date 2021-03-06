const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Joi = require("joi");
const {User} = require('../models/user');



module.exports = router;
