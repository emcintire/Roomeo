const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
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
    img: {
        type: String,
        default: '',
    },
    interests: [String],
    location: {
        type: { 
            type: String,
            default: 'Point', 
        },
        address: { type: String },
        coordinates: {
            type: [Number],
            default: [0,0]
        },
    },
    likes: [String],
    dislikes: [String],
    matches: [{
        time : { type : Date, default: Date.now },
        user: { type : String },
        messages: [{
            u_id: String,
            content: String,
            time: {
                type: Date,
                default: Date.now
            },
        }]
    }]
});

userSchema.index({ location: '2dsphere' });

userSchema.methods.generateAuthToken = function () {
    //Generates a json web token used for logging in users
    return jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get('jwtPrivateKey')
        );
    };
    
const User = mongoose.model('User', userSchema);

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
    name: Joi.string().min(1).max(100).allow(null, ''),
    email: Joi.string().min(1).max(255).email(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
    bio: Joi.string().max(512).allow(null, ''),
    gender: Joi.string().allow(null, ''),
    age: Joi.number().min(18).max(200).allow(null, ''),
    address: Joi.string().max(200).allow(null, ''),
    interests: Joi.array().items(Joi.string()).allow(null, '')
});

const getIdFromToken = function (token) {
    //Decodes the json web token and returns the users id
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    return decoded._id;
};

const milesToRadian = function(miles){
    const earthRadiusInMiles = 3963;
    return miles / earthRadiusInMiles;
};

Array.prototype.remove_by_value = function(val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === val) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
};

exports.remove_by_value = this.remove_by_value;
exports.milesToRadian = milesToRadian;
exports.getIdFromToken = getIdFromToken;
exports.schema = schema;
exports.updateSchema = updateSchema;
exports.User = User;
