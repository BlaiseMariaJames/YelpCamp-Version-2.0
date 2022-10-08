// REQUIRING SANITIZE-HTML NODE MODULE
const sanitizeHtml = require("sanitize-html");

// DEFINING JOI EXTENSION TO ESCAPE HTML
const escapeHTMLExtension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', { value });
                }
                return clean;
            }
        }
    }
});

module.exports = escapeHTMLExtension;