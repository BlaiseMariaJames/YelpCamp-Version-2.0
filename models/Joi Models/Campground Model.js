// REQUIRING JOI AND OBJECT ID
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// DEFINING CAMPGROUND SCHEMA
const CampgroundSchema = Joi.object({
    author: Joi.objectId().required(),
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    imageURL: Joi.string().allow(''),
    description: Joi.string().allow('')
});

// EXPORTING CAMPGROUND SCHEMA
module.exports = CampgroundSchema;  