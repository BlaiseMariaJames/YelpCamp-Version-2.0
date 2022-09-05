// REQUIRING MONGOOSE
const mongoose = require("mongoose");

// STORING SCHEMA OBJECT INTO A VARIABLE
const Schema = mongoose.Schema;

// DEFINING REVIEW SCHEMA
const ReviewSchema = new Schema({
    body: {
        type: String,
        required: [true, "The body of a review cannot be empty"]
    },
    rating: {
        type: String,
        validate: {
            validator: function (rating) {
                return /^[1-5]$/.test(rating);
            },
            message: "Rating of the campground has to be a number within the range 1-5"
        },
        required: [true, "The rating of a review cannot be empty"]
    }
});

// DEFINING REVIEW MODEL
const Review = mongoose.model('Review', ReviewSchema);

// EXPORTING REVIEW MODEL
module.exports = Review;