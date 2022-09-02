// REQUIRING MONGOOSE
const mongoose = require("mongoose");

// STORING SCHEMA OBJECT INTO A VARIABLE
const Schema = mongoose.Schema;

// DEFINING CAMPGROUND SCHEMA
const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: [true, "The field 'title' is mandatory"]
    },
    imageURL: {
        type: String
    },
    price: {
        type: String,
        validate: {
            validator: function (price) {
                return /^\d+$/.test(price);
            },
            message: "Price of the campground has to be a number with a minimum value of 0"
        },
        required: [true, "The field 'price' is mandatory"]
    },
    description: {
        type: String
    },
    location: {
        type: String,
        required: [true, "The field 'location' is mandatory"]
    }
});

// DEFINING CAMPGROUND MODEL
const Campground = mongoose.model('Campground', CampgroundSchema);

// EXPORTING CAMPGROUND MODEL
module.exports = Campground;