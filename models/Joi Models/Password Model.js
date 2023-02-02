// REQUIRING JOI
let Joi = require("joi");

// ADD ESCAPE HTML EXTENSION TO JOI
const escapeHTMLExtension = require("../../utilities/Security/JOI Escape HTML Extension");
Joi = Joi.extend(escapeHTMLExtension);

// DEFINING PASSWORD SCHEMA
const PasswordSchema = Joi.object({
    // New password is optional for edit profile, hence allow('').
    newPassword: Joi.string().allow('')
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)
        .messages({
            'string.base': '"new password" must be a string',
            'string.empty': '"new password" cannot be an empty string',
            'string.pattern.base': '"new password" failed to satisfy the instructions. It must be between 8 to 15 characters long and include a mix of uppercase and lowercase letters, at least one digit, and at least one special character from [@, $, !, %, *, ?, &]',
        })
        .escapeHTML(),
    // Confirm password is optional for edit profile, hence allow('').
    confirmPassword: Joi.string().allow('')
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)
        .messages({
            'string.base': '"confirm password" must be a string',
            'string.empty': '"confirm password" cannot be an empty string',
            'string.pattern.base': '"confirm password" failed to satisfy the instructions. It must be between 8 to 15 characters long and include a mix of uppercase and lowercase letters, at least one digit, and at least one special character from [@, $, !, %, *, ?, &]',
        })
        .escapeHTML()
});

// EXPORTING PASSWORD SCHEMA
module.exports = PasswordSchema;