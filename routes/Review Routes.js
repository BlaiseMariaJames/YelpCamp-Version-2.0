// REQUIRING EXPRESS
const express = require("express");

// CREATING ROUTER INSTANCE 
const router = express.Router(
    /* Setting mergeParams to true will merge request.params of the main app file to this file.
    
    Use case:
    =========
    
    The router object cannot access the campground id even though if it is specified in the URL ('/campgrounds/:campgroundId/reviews'). 
    It is because the router object adds the string '/campgrounds/:campgroundId/reviews' after requiring this file in the main app.
    Therefore the campgroundId is not accessible through request.params in this file rather can be only be accessed in main app.
    And hence we merge the request.params of the main app with this file to access the parameters.
    
    */
    { mergeParams: true }
);

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../utilities/Application Error Handler Class.js");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("../utilities/Async Error Handling Middleware Function.js");

// REQUIRING REVIEW MODEL AND SCHEMA
const Review = require("../models/Mongoose Models/Review Model.js");
const ReviewSchema = require("../models/Joi Models/Review Model.js");

// REQUIRING CAMPGROUND MODEL
const Campground = require("../models/Mongoose Models/Campground Model.js");

// RESPONDING TO THE SERVER AT REVIEW MODEL BASED ROUTE

// Create --> Creates new review on server.
router.post('/', handleAsyncErrors(async (request, response, next) => {
    let { campgroundId } = request.params;
    let { review } = request.body;
    const { error } = ReviewSchema.validate(review);
    const campground = await Campground.findById(campgroundId).populate('reviews');
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        errorMessage = `Cannot create review, ${errorMessage}.`;
        response.status(400).render('campgrounds/Show', { title: campground.title, error: errorMessage, campground });
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        review.body = review.body.replace(/[\r\n\t]/gm, ' ');
        const newReview = new Review(review);
        await newReview.save();
        campground.reviews.push(newReview);
        await campground.save();
        response.redirect(`/campgrounds/${campground._id}`);
    }
}));

// Delete --> Deletes a review on server.
router.delete('/:reviewId', handleAsyncErrors(async (request, response, next) => {
    const { campgroundId, reviewId } = request.params;
    const campground = await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
        .then(() => {
            response.redirect(`/campgrounds/${campground._id}`);
        })
        .catch((error) => {
            return next(new ApplicationError(error.message, error.name));
        });
}));

// EXPORTING ROUTER INSTANCE
module.exports = router;