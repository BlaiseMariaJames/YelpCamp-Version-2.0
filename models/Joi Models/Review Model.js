// REQUIRING JOI AND OBJECT ID
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// DEFINING REVIEW SCHEMA
const ReviewSchema = Joi.object({
    author: Joi.objectId().required(),
    body: Joi.string().required().label("review"),
    rating: Joi.number().min(0).max(5).required()
});

// EXPORTING REVIEW SCHEMA
module.exports = ReviewSchema; 