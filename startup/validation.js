const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = function () {
    Joi.objectId = require("joi-objectid")(Joi);
};
