const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userShema = new mongoose.Schema({
    //Mongoose user schema
    isAdmin: {
        type: Boolean,
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    age: {
        type: Number,
        min: 18,
        max: 200,
        default: 18,
    },
    gender: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        maxlength: 512,
        default: '',
    },
    imgs: [{ 
        priority: {
            type: Number,
            default: 0
        },
        path: {
            type: String,
            default: ''
        } 
    }],
    // location: {
    //     type: new mongoose.Schema({
    //         street: {
    //             type: String,
    //             minlength: 2,
    //             maxlength: 100,
    //             default: ''
    //         },
    //         city: {
    //             type: String,
    //             minlength: 2,
    //             maxlength: 100,
    //             default: ''
    //         },
    //         coords: {
    //             type: Point
    //         }
    //     })
    // }
});

userShema.methods.generateAuthToken = function () {
    //Generates a json web token used for logging in users
    return jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get('jwtPrivateKey')
    );
};

const User = mongoose.model('User', userShema);

const schema = Joi.object({
    //Validates the user object when the user is first created
    name: Joi.string().min(1).max(100).required(),
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .required(),
});

const updateSchema = Joi.object({
    //Validates the user object for updating user after initial user creation
    name: Joi.string().min(1).max(100),
    email: Joi.string().min(1).max(255).email(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
    bio: Joi.string().max(512),
    gender: Joi.string(),
    age: Joi.number().min(18).max(200),
});

const getIdFromToken = function (token) {
    //Decodes the json web token and returns the users id
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    return decoded._id;
};

exports.getIdFromToken = getIdFromToken;
exports.schema = schema;
exports.updateSchema = updateSchema;
exports.User = User;
