// REQUIRING JOI AND OBJECT ID
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// DEFINING CAMPGROUND SCHEMA
const CampgroundSchema = Joi.object({
    author: Joi.objectId().required(),
    title: Joi.string().required(),
    imageURL: Joi.string().allow(''),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().allow('')
});

// EXPORTING CAMPGROUND SCHEMA
module.exports = CampgroundSchema;  