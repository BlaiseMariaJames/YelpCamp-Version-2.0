// REQUIRING OBJECT ID
const ObjectID = require("mongoose").Types.ObjectId;

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../utilities/Application Error Handler Class.js");

// REQUIRING CAMPGROUND MODEL AND SCHEMA
const Campground = require("../models/Mongoose Models/Campground Model.js");
const CampgroundSchema = require("../models/Joi Models/Campground Model.js");

// CREATE OPERATION ROUTES

// New --> Form to create a new campground.
module.exports.renderNewForm = (request, response) => {
    response.render('campgrounds/New', { title: "New Campground" });
}

// Create --> Creates new campground on server.
module.exports.createCampground = async (request, response, next) => {
    let { campground } = request.body;
    campground.author = request.user._id.toString();
    const { error } = CampgroundSchema.validate(campground);
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Cannot create campground, ${errorMessage}.`);
        response.status(400).redirect('/campgrounds/new');
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        const newCampground = new Campground(campground);
        await newCampground.save();
        request.flash('success', 'Successfully created a new Campground!');
        response.redirect(`/campgrounds/${newCampground._id}`);
    }
}

// READ OPERATION ROUTES

// Show --> Details for one specific campground.
module.exports.showCampground = async (request, response, next) => {
    const { id } = request.params;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    response.render('campgrounds/Show', { title: campground.title, campground });
}

// Index --> Display all campgrounds.
module.exports.allCampgrounds = async (request, response, next) => {
    let errorMessage = "";
    let campgrounds = await Campground.find({}).populate('author');
    if (campgrounds.length > 0) {
        response.render('campgrounds/Index', { title: "All Campgrounds", campgrounds, errorMessage });
    } else {
        errorMessage = "No campgrounds are currently available.";
        response.render('campgrounds/Index', { title: "All Campgrounds", campgrounds, errorMessage });
    }
}

// UPDATE OPERATION ROUTES

// Edit --> Form to edit a campground.
module.exports.renderEditForm = async (request, response, next) => {
    const { id } = request.params;
    const campground = await Campground.findById(id).populate('author');
    response.render('campgrounds/Edit', { title: "Edit Campground", campground });
}

// Update --> Updates a campground on server.
module.exports.updateCampground = async (request, response, next) => {
    let { id, campground } = request.body;
    const { error } = CampgroundSchema.validate(campground);
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        campground._id = id;
        request.flash('error', `Cannot edit campground, ${errorMessage}.`);
        response.status(400).redirect(`/campgrounds/${id}/edit`);
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        const newCampground = await Campground.findById(id);
        Object.assign(newCampground, campground);
        await newCampground.save();
        request.flash('success', 'Successfully edited the Campground!');
        response.redirect(`/campgrounds/${newCampground._id}`);
    }
}

// DELETE OPERATIONS ROUTES

// Remove --> Form to remove a campground.
module.exports.renderRemoveForm = async (request, response, next) => {
    const { id } = request.params;
    const campground = await Campground.findById(id);
    response.render('campgrounds/Remove', { title: "Remove Campground", campground });
}

// Delete --> Deletes a campground on server.
module.exports.deleteCampground = async (request, response, next) => {
    const { id } = request.body;
    await Campground.findByIdAndDelete(id)
        .then(() => {
            request.flash('success', 'Successfully deleted the Campground!');
            response.redirect('/campgrounds');
        })
        .catch((error) => {
            return next(new ApplicationError(error.message, error.name));
        });
}