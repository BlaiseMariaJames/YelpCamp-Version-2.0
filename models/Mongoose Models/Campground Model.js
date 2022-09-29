// REQUIRING MONGOOSE AND OBJECT ID
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// STORING SCHEMA OBJECT INTO A VARIABLE
const Schema = mongoose.Schema;

// REQUIRING MODELS ASSOCIATED WITH CAMPGROUND
const Review = require("./Review Model");

// DEFINING CAMPGROUND SCHEMA
const CampgroundSchema = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: [true, "The field 'author' is mandatory"]
    },
    title: {
        type: String,
        required: [true, "The field 'title' is mandatory"]
    },
    location: {
        type: String,
        required: [true, "The field 'location' is mandatory"]
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
    imageURL: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
            // A campground may or may not have any reviews.
            required: false
        }
    ]
});

// DEFINING POST-MIDDLEWARE-FUNCTION AFTER DELETING A CAMPGROUND
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    // Check for items of associated model. In this case, reviews.
    if (campground.reviews.length > 0) {
        // Delete all items inside associated model.
        await Review.deleteMany({
            // Delete every item of associated model, whose id belongs to Campground. 
            _id: { $in: campground.reviews }
        });
    }
    // Continue the same procedure for rest of the associated models.
});

// DEFINING CAMPGROUND MODEL
const Campground = mongoose.model('Campground', CampgroundSchema);

// EXPORTING CAMPGROUND MODEL
module.exports = Campground;