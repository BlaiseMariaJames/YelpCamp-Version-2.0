// REQUIRING JOI
const Joi = require("joi");

// DEFINING USER SCHEMA
const UserSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// EXPORTING USER SCHEMA
module.exports = UserSchema;