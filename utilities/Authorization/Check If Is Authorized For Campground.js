// REQUIRING CAMPGROUND MODEL AND OBJECT ID
const Campground = require("../../models/Mongoose Models/Campground Model.js");
const ObjectID = require("mongoose").Types.ObjectId;

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../../utilities/Error Handling/Application Error Handler Class.js");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("../../utilities/Error Handling/Async Error Handling Middleware Function.js");

// DEFINING MIDDLEWARE FUNCTION TO CHECK IF CAMPGROUND ID IS VALID, CAMPGROUND EXISTS AND CURRENT USER IS AUTHORIZED TO EDIT OR DELETE THAT CAMPGROUND
const isAuthorized = handleAsyncErrors(async (request, response, next) => {
    const id = request.params.id || request.body.id;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id).populate('author');
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    if (!campground.author.equals(request.user._id)) {
        // USER IS NOT AUTHORIZED
        request.flash('error', 'You do not own this Campground!');
        return response.redirect(`/campgrounds/${id}`);
    }
    next();
});

module.exports = isAuthorized;  