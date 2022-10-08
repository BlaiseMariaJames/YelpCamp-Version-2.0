// REQUIRING JOI AND OBJECT ID
let Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// ADD ESCAPE HTML EXTENSION TO JOI
const escapeHTMLExtension = require("../../utilities/Security/JOI Escape HTML Extension");
Joi = Joi.extend(escapeHTMLExtension);

// DEFINING REVIEW SCHEMA
const ReviewSchema = Joi.object({
    author: Joi.objectId().required(),
    body: Joi.string().required().label("review").escapeHTML(),
    rating: Joi.number().min(0).max(5).required()
});

// EXPORTING REVIEW SCHEMA
module.exports = ReviewSchema; 