// REQUIRING MONGOOSE, OBJECT ID AND CLOUDINARY
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { cloudinary } = require("../../utilities/Cloudinary/Cloudinary Configuration");

// STORING SCHEMA OBJECT INTO A VARIABLE
const Schema = mongoose.Schema;

// REQUIRING MODELS ASSOCIATED WITH CAMPGROUND
const Review = require("./Review Model");

// DEFINING IMAGE SCHEMA
const ImageSchema = new Schema({
    _id: { _id: false },
    url: {
        type: String,
        required: [true, "The field 'image url' is mandatory"]
    },
    filename: {
        type: String,
        required: [true, "The field 'image filename' is mandatory"]
    }
});

// DEFINING VIRTUAL FUNCTION TO SET VIRTUAL PROPERTY 'THUMBNAIL' FOR AN IMAGE
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300,h_300');
});

// DEFINING VIRTUAL FUNCTION TO SET VIRTUAL PROPERTY 'CARDIMAGE' FOR AN IMAGE
ImageSchema.virtual('cardImage').get(function () {
    return this.url.replace('/upload', '/upload/w_500,h_500');
});

// DEFINING CATEGORY SCHEMA
const CategorySchema = new Schema({
    typeOf: {
        type: String,
        required: true,
        default: "rv",
        enum: ['rv', 'tent', 'backcountry', 'cabin']
    },
    location: {
        type: String,
        required: true,
        default: "beach",
        enum: ['beach', 'desert', 'forest', 'mountain', 'lakefront']
    },
    amenity: {
        type: String,
        required: true,
        default: "family",
        enum: ['family', 'luxury', 'economic', 'pet-friendly']
    },
    activity: {
        type: String,
        required: true,
        default: "adventure",
        enum: ['adventure', 'educational', 'hunting', 'festival']
    }
});

// DEFINING CAMPGROUND SCHEMA OPTIONS
const options = {
    // WHEN CONVERTED TO JSON, ADD VIRTUAL PROPERTIES TO THE RESULT
    toJSON: { virtuals: true }
};

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
    accurateLocation: {
        type: String,
        required: [true, "The field 'accurate location' is mandatory to be selected"]
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: [true, "The field 'type' of geometry is mandatory"]
        },
        coordinates: {
            type: [Number],
            required: [true, "The field 'co-ordinates' of geometry is mandatory"]
        }
    },
    price: {
        type: Number,
        min: 0,
        required: [true, "The field 'price' is mandatory"]
    },
    description: {
        type: String
    },
    categories: {
        type: CategorySchema,
        required: [true, "The field 'categories' is mandatory"]
    },
    addedOn: {
        type: Date,
        required: [true, "The field 'addedOn' is mandatory"]
    },
    images: [ImageSchema],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
            // A campground may or may not have any reviews.
            required: false
        }
    ],
    avgRating: {
        type: Number,
        default: 0
    }
}, options);

// DEFINING VIRTUAL FUNCTION TO SET VIRTUAL PROPERTY OBJECT 'PROPERTIES' WITH PROPERTY 'POPUPMARKUP' FOR A CAMPGROUND
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<div class='card popup'><div class='card-header'><a href='/campgrounds/${this._id}' title='View Campground'><h5>${this.title}</h5></a></div><div class='card-body'><p class='card-text text-muted'>${this.location}</p></div></div>`;
});

// DEFINING POST-MIDDLEWARE-FUNCTION AFTER DELETING A CAMPGROUND
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    // Check for reviews associated to Campground.
    if (campground.reviews.length > 0) {
        // Delete all reviews associated to Campground.
        await Review.deleteMany({
            // Delete every review, whose id belongs to Campground. 
            _id: { $in: campground.reviews }
        });
    }
    // Check for images associated to Campground.
    if (campground.images.length > 0) {
        // Delete all images associated to Campground.
        for (let file of campground.images) {
            // Delete every image, whose id belongs to Campground. 
            cloudinary.uploader.destroy(file.filename);
        }
    }
    // Continue the same procedure for rest of the associated models.
});

// DEFINING CAMPGROUND INSTANCE METHOD TO FIND AVERAGE RATING OF A SPECIFIC CAMPGROUND
CampgroundSchema.methods.calculateAvgRating = function () {
    const totalReviews = this.reviews.length;
    if (totalReviews > 0) {
        const ratingsTotal = this.reviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
        this.avgRating = Math.round((ratingsTotal / totalReviews) * 10) / 10;
    } else {
        this.avgRating = 0;
    }
    this.save();
    return Math.floor(this.avgRating);
};

// DEFINING 2DSPHERE INDEXES THAT SUPPORT GEOSPATIAL QUERIES ON OUR MAP.
CampgroundSchema.index({ geometry: '2dsphere' });

// DEFINING CAMPGROUND MODEL
const Campground = mongoose.model('Campground', CampgroundSchema);

// EXPORTING CAMPGROUND MODEL
module.exports = Campground;