// REQUIRING OBJECT ID AND CLOUDINARY 
const ObjectID = require("mongoose").Types.ObjectId;
const { cloudinary } = require("../utilities/Cloudinary/Cloudinary Configuration");

// CONFIGURING MAPBOX GEOCODING
const mapboxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mapboxGeoCoding({ accessToken: mapboxToken });

// REQUIRING CAMPGROUND MODEL AND SCHEMA
const Campground = require("../models/Mongoose Models/Campground Model.js");
const CampgroundSchema = require("../models/Joi Models/Campground Model.js");

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../utilities/Error Handling/Application Error Handler Class.js");

// REQUIRING FUNCTION TO DELETE CAMPGROUND IMAGES FROM CLOUDINARY (IF IN CASE OF ANY ERROR WHILE UPLOADING)
const deleteCampgroundImages = require("../utilities/Cloudinary/Delete Cloudinary Images");

// CREATE OPERATION ROUTES

// New --> Form to create a new campground.
module.exports.renderNewForm = (request, response) => {
    response.render('campgrounds/New', { title: "New Campground", places: "", campground: "" });
}

// Create --> Creates new campground on server.
module.exports.createCampground = async (request, response, next) => {
    let { campground } = request.body;
    campground.author = request.user._id.toString();
    campground.images = request.files.map(file => ({ url: file.path, filename: file.filename }));
    const geoData = await geoCoder.forwardGeocode({
        query: campground.location
    }).send();
    if (!campground.accurateLocation) {
        return response.render('campgrounds/New', { title: "New Campground", places: geoData.body.features, campground });
    } else {
        campground.location = campground.accurateLocation;
        campground.geometry = geoData.body.features.find(function (place) {
            return place.place_name === campground.accurateLocation;
        }).geometry;
    }
    const { error } = CampgroundSchema.validate(campground);
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        if (request.files) {
            // delete uploaded cloudinary images.
            deleteCampgroundImages(request.files);
        }
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
module.exports.renderEditForm = async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findById(id).populate('author');
    response.render('campgrounds/Edit', { title: "Edit Campground", places: "", campground });
}

// Update --> Updates a campground on server.
module.exports.updateCampground = async (request, response, next) => {
    let { id, campground } = request.body;
    const oldCampground = await Campground.findById(id);
    const geoData = await geoCoder.forwardGeocode({
        query: campground.location
    }).send();
    if (!campground.accurateLocation) {
        Object.assign(oldCampground, campground);
        return response.render('campgrounds/Edit', { title: "Edit Campground", places: geoData.body.features, campground: oldCampground });
    } else {
        campground.location = campground.accurateLocation;
        campground.geometry = geoData.body.features.find(function (place) {
            return place.place_name === campground.accurateLocation;
        }).geometry;
    }
    const { error } = CampgroundSchema.validate(campground);
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Cannot edit campground, ${errorMessage}.`);
        response.status(400).redirect(`/campgrounds/${id}/edit`);
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        Object.assign(oldCampground, campground);
        await oldCampground.save();
        request.flash('success', 'Successfully edited the Campground!');
        response.redirect(`/campgrounds/${oldCampground._id}`);
    }
}

// Manage --> Form to manage campground images.
module.exports.renderManageForm = async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findById(id).populate('author');
    response.render('campgrounds/Manage', { title: "Manage Campground Images", campground });
}

// Redesign --> Manages campground images on server.
module.exports.redesignCampground = async (request, response) => {
    let { id } = request.body;
    const oldCampground = await Campground.findById(id);
    // Pushing images.
    const campgroundImages = request.files.map(file => ({ url: file.path, filename: file.filename }));
    oldCampground.images.push(...campgroundImages);
    await oldCampground.save();
    // Deleting images.
    if (request.body.deleteCampgroundImages) {
        for (let filename of request.body.deleteCampgroundImages) {
            cloudinary.uploader.destroy(filename);
        }
        await oldCampground.updateOne({ $pull: { images: { filename: { $in: request.body.deleteCampgroundImages } } } });
    }
    request.flash('success', 'Successfully edited the Campground!');
    response.redirect(`/campgrounds/${oldCampground._id}`);
}

// DELETE OPERATIONS ROUTES

// Remove --> Form to remove a campground.
module.exports.renderRemoveForm = async (request, response) => {
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