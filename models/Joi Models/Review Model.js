// REQUIRING JOI
const Joi = require("joi");

// DEFINING REVIEW SCHEMA
const ReviewSchema = Joi.object({
    body: Joi.string().required().label("review"),
    rating: Joi.number().min(1).max(5).required()
});

module.exports = ReviewSchema; 