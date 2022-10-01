// REQUIRING JOI AND OBJECT ID
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// DEFINING CAMPGROUND SCHEMA
const CampgroundSchema = Joi.object({
    author: Joi.objectId().required(),
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    images: Joi.array().items(Joi.object({
        url: Joi.string().required(),
        filename: Joi.string().required()
    }).allow('')),
    description: Joi.string().allow('')
});

// EXPORTING CAMPGROUND SCHEMA
module.exports = CampgroundSchema;  