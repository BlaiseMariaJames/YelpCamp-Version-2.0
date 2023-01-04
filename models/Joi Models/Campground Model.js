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
    categories: Joi.object({
        typeOf: Joi.string().required().valid('rv', 'tent', 'backcountry', 'cabin').escapeHTML(),
        location: Joi.string().required().valid('beach', 'desert', 'forest', 'mountain', 'lakefront').escapeHTML(),
        amenity: Joi.string().required().valid('family', 'luxury', 'economic', 'pet-friendly').escapeHTML(),
        activity: Joi.string().required().valid('adventure', 'educational', 'hunting', 'festival').escapeHTML()
    }).required(),
    description: Joi.string().allow('').escapeHTML(),
    addedOn: Joi.date().required()
});

// EXPORTING CAMPGROUND SCHEMA
module.exports = CampgroundSchema;