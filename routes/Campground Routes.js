// REQUIRING EXPRESS AND OBJECT ID
const express = require("express");
const ObjectID = require("mongoose").Types.ObjectId;

// CREATING ROUTER INSTANCE
const router = express.Router();

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../utilities/Application Error Handler Class.js");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("../utilities/Async Error Handling Middleware Function.js");

// REQUIRING CAMPGROUND MODEL AND SCHEMA
const Campground = require("../models/Mongoose Models/Campground Model.js");
const CampgroundSchema = require("../models/Joi Models/Campground Model.js");

// RESPONDING TO THE SERVER AT CAMPGROUND MODEL BASED ROUTE

// CREATE OPERATION ROUTES

// New --> Form to create a new campground.
router.get('/new', (request, response) => {
    let error = "";
    response.render('campgrounds/New', { title: "New Campground", error });
});

// Create --> Creates new campground on server.
router.post('/', handleAsyncErrors(async (request, response, next) => {
    let { campground } = request.body;
    const { error } = CampgroundSchema.validate(campground);
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        errorMessage = `Cannot create campground, ${errorMessage}.`;
        response.status(400).render('campgrounds/New', { title: "Create Campground", error: errorMessage });
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        const newCampground = new Campground(campground);
        await newCampground.save();
        response.redirect(`/campgrounds/${newCampground._id}`);
    }
}));

// READ OPERATION ROUTES

// Show --> Details for one specific campground.
router.get('/:id', handleAsyncErrors(async (request, response, next) => {
    let error = "";
    const { id } = request.params;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    response.render('campgrounds/Show', { title: campground.title, error, campground });
}));

// Index --> Display all campgrounds.
router.get('/', handleAsyncErrors(async (request, response, next) => {
    let error = "";
    let campgrounds = await Campground.find({});
    if (campgrounds.length > 0) {
        response.render('campgrounds/Index', { title: "All Campgrounds", campgrounds, error });
    } else {
        error = "No campgrounds are currently available.";
        response.render('campgrounds/Index', { title: "All Campgrounds", campgrounds, error });
    }
}));

// UPDATE OPERATION ROUTES

// Edit --> Form to edit a campground.
router.get('/:id/edit', handleAsyncErrors(async (request, response, next) => {
    let error = "";
    const { id } = request.params;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    response.render('campgrounds/Edit', { title: "Edit Campground", campground, error });
}));

// Update --> Updates a campground on server.
router.patch('/', handleAsyncErrors(async (request, response, next) => {
    let { id, campground } = request.body;
    const { error } = CampgroundSchema.validate(campground);
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        campground._id = id;
        errorMessage = `Cannot edit campground, ${errorMessage}.`;
        response.status(400).render('campgrounds/Edit', { title: "Edit Campground", campground, error: errorMessage });
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        const newCampground = await Campground.findById(id);
        Object.assign(newCampground, campground);
        await newCampground.save();
        response.redirect(`/campgrounds/${newCampground._id}`);
    }
}));

// DELETE OPERATIONS ROUTES

// Remove --> Form to remove a campground.
router.get('/:id/remove', handleAsyncErrors(async (request, response, next) => {
    const { id } = request.params;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    response.render('campgrounds/Remove', { title: "Remove Campground", campground });
}));

// Delete --> Deletes a campground on server.
router.delete('/', handleAsyncErrors(async (request, response, next) => {
    const { id } = request.body;
    await Campground.findByIdAndDelete(id)
        .then(() => {
            response.redirect('/campgrounds');
        })
        .catch((error) => {
            return next(new ApplicationError(error.message, error.name));
        });
}));

// EXPORTING ROUTER INSTANCE
module.exports = router;