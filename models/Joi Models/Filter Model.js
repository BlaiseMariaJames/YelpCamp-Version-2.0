// REQUIRING JOI
let Joi = require("joi");

// ADD ESCAPE HTML EXTENSION TO JOI
const escapeHTMLExtension = require("../../utilities/Security/JOI Escape HTML Extension");
Joi = Joi.extend(escapeHTMLExtension);

// DEFINING FILTER SCHEMA
const FilterSchema = Joi.object({
    search: Joi.string().allow('').escapeHTML(),
    location: Joi.string().allow('').escapeHTML(),
    distance: Joi.number().allow('').valid(25, 50, 100),
    price: Joi.object({
        min: Joi.number().min(0).allow(''),
        max: Joi.number().min(0).allow('')
    }),
    avgRating: Joi.number().allow('').valid(0, 3, 3.5, 4, 4.5)
});

// EXPORTING FILTER SCHEMA
module.exports = FilterSchema;