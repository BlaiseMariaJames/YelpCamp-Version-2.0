// REQUIRING REVIEW MODEL
const Review = require("../models/Mongoose Models/Review Model.js");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("../utilities/Async Error Handling Middleware Function.js");

// DEFINING MIDDLEWARE FUNCTION TO CHECK IF CURRENT USER IS AUTHORIZED TO EDIT OR DELETE A REVIEW
const isAuthorized = handleAsyncErrors(async (request, response, next) => {
    const { campgroundId, reviewId } = request.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(request.user._id)) {
        // USER IS NOT AUTHORIZED
        request.flash('error', 'You do not own this Review!');
        return response.redirect(`/campgrounds/${campgroundId}`);
    }
    next();
});

module.exports = isAuthorized;  