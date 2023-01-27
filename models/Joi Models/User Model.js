// REQUIRING JOI
let Joi = require("joi");

// ADD ESCAPE HTML EXTENSION TO JOI
const escapeHTMLExtension = require("../../utilities/Security/JOI Escape HTML Extension");
Joi = Joi.extend(escapeHTMLExtension);

// DEFINING USER SCHEMA
const UserSchema = Joi.object({
    username: Joi.string().required()
        .pattern(/^[a-z](?!.*__)[a-z0-9_]{1,18}[a-z0-9]$/)
        .messages(
            { 'string.pattern.base': '"username" failed to satisfy the instructions' }
        )
        .escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML(),
    password: Joi.string().required().escapeHTML(),
    newPassword: Joi.string().allow('').escapeHTML(),
    confirmPassword: Joi.string().allow('').escapeHTML()
});

// EXPORTING USER SCHEMA
module.exports = UserSchema;