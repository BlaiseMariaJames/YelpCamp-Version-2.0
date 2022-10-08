// REQUIRING JOI AND OBJECT ID
let Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// ADD ESCAPE HTML EXTENSION TO JOI
const escapeHTMLExtension = require("../../utilities/Security/JOI Escape HTML Extension");
Joi = Joi.extend(escapeHTMLExtension);

// DEFINING CAMPGROUND SCHEMA
const CampgroundSchema = Joi.object({
    author: Joi.objectId().required(),
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    accurateLocation: Joi.string().required().escapeHTML(),
    geometry: Joi.object().keys({
        type: Joi.string().valid('Point').required().escapeHTML(),
        coordinates: Joi.array().items(Joi.number()).required()
    }).required(),
    price: Joi.number().required().min(0),
    images: Joi.array().items(Joi.object({
        url: Joi.string().required().escapeHTML(),
        filename: Joi.string().required().escapeHTML()
    }).allow('')),
    description: Joi.string().allow('').escapeHTML()
});

// EXPORTING CAMPGROUND SCHEMA
module.exports = CampgroundSchema;