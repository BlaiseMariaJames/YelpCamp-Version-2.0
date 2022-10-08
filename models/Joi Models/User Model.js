// REQUIRING JOI
let Joi = require("joi");

// ADD ESCAPE HTML EXTENSION TO JOI
const escapeHTMLExtension = require("../../utilities/Security/JOI Escape HTML Extension");
Joi = Joi.extend(escapeHTMLExtension);

// DEFINING USER SCHEMA
const UserSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML(),
    password: Joi.string().required().escapeHTML()
});

// EXPORTING USER SCHEMA
module.exports = UserSchema;