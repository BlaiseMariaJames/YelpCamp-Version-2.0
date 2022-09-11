// REQUIRING JOI
const Joi = require("joi");

// DEFINING CAMPGROUND SCHEMA
const CampgroundSchema = Joi.object({
    title: Joi.string().required(),
    imageURL: Joi.string().allow(''),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().allow('')
});

// EXPORTING CAMPGROUND SCHEMA
module.exports = CampgroundSchema;  