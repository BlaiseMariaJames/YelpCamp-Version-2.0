// REQUIRING JOI
let Joi = require("joi");

// ADD ESCAPE HTML EXTENSION TO JOI
const escapeHTMLExtension = require("../../utilities/Security/JOI Escape HTML Extension");
Joi = Joi.extend(escapeHTMLExtension);

// DEFINING USER SCHEMA
const UserSchema = Joi.object({
    username: Joi.string().required()
        .pattern(/^[a-z](?!.*__)[a-z0-9_]{1,18}[a-z0-9]$/)
        .messages({
            'string.base': '"username" must be a string',
            'string.empty': '"username" cannot be an empty string',
            'string.pattern.base': '"username" failed to satisfy the instructions. It must start with a lowercase letter, be between 3 to 20 characters long, must contain ONLY lowercase letters, numbers or underscores, end with a letter or number, and not contain a sequence of two or more underscores',
            'any.required': '"username" is required'
        })
        .escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML(),
    bio: Joi.string().allow('').escapeHTML(),
    password: Joi.string().required()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)
        .messages({
            'string.base': '"password" must be a string',
            'string.empty': '"password" cannot be an empty string',
            'string.pattern.base': '"password" failed to satisfy the instructions. It must be between 8 to 15 characters long and include a mix of uppercase and lowercase letters, at least one digit, and at least one special character from [@, $, !, %, *, ?, &]',
            'any.required': '"password" is required'
        })
        .escapeHTML(),
    image: Joi.object({
        url: Joi.string().required().escapeHTML(),
        filename: Joi.string().required().escapeHTML()
    }).allow(''),
    newPassword: Joi.string().allow('')
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)
        .messages({
            'string.base': '"new password" must be a string',
            'string.empty': '"new password" cannot be an empty string',
            'string.pattern.base': '"new password" failed to satisfy the instructions. It must be between 8 to 15 characters long and include a mix of uppercase and lowercase letters, at least one digit, and at least one special character from [@, $, !, %, *, ?, &]',
        })
        .escapeHTML(),
    confirmPassword: Joi.string().allow('')
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)
        .messages({
            'string.base': '"confirm password" must be a string',
            'string.empty': '"confirm password" cannot be an empty string',
            'string.pattern.base': '"confirm password" failed to satisfy the instructions. It must be between 8 to 15 characters long and include a mix of uppercase and lowercase letters, at least one digit, and at least one special character from [@, $, !, %, *, ?, &]',
        })
        .escapeHTML()
});

// EXPORTING USER SCHEMA
module.exports = UserSchema;