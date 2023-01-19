// REQUIRING CAMPGROUND MODEL
const Campground = require("../models/Mongoose Models/Campground Model.js");

// REQUIRING REVIEW MODEL AND SCHEMA
const Review = require("../models/Mongoose Models/Review Model.js");
const ReviewSchema = require("../models/Joi Models/Review Model.js");

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../utilities/Error Handling/Application Error Handler Class.js");

// Create --> Creates new review on server.
module.exports.createReview = async (request, response, next) => {
    let { campgroundId } = request.params;
    let { review } = request.body;
    review.author = request.user._id.toString();
    const { error } = ReviewSchema.validate(review);
    const campground = await Campground.findById(campgroundId).populate('reviews');
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Cannot create review, ${errorMessage}.`);
        response.status(400).redirect(`/campgrounds/${campgroundId}`);
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        review.body = review.body.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
        const newReview = new Review(review);
        await newReview.save();
        campground.reviews.push(newReview);
        await campground.save();
        request.flash('success', 'Successfully created a new Review!');
        response.redirect(`/campgrounds/${campground._id}`);
    }
}

// Delete --> Deletes a review on server.
module.exports.deleteReview = async (request, response, next) => {
    const { campgroundId, reviewId } = request.params;
    const campground = await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
        .then(() => {
            request.flash('success', 'Successfully deleted the Review!');
            response.redirect(`/campgrounds/${campground._id}`);
        })
        .catch((error) => {
            return next(new ApplicationError(error.message, error.name));
        });
}