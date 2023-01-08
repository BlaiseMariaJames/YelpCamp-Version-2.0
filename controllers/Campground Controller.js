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

// REQUIRING VARIOUS AVAILABLE CAMPGROUND CATEGORIES DEFINED IN THE DATABASE
const dbCategories = {
    Types: {
        key: "typeOf",
        formLabel: "Type",
        values: ['rv', 'tent', 'backcountry', 'cabin']
    },
    Locations: {
        key: "location",
        formLabel: "Location Type",
        values: ['beach', 'desert', 'forest', 'mountain', 'lakefront']
    },
    Amenities: {
        key: "amenity",
        formLabel: "Amenity",
        values: ['family', 'luxury', 'economic', 'pet-friendly']
    },
    Activities: {
        key: "activity",
        formLabel: "Activity",
        values: ['adventure', 'educational', 'hunting', 'festival']
    }
};

// CREATE OPERATION ROUTES

// New --> Form to create a new campground.
module.exports.renderNewForm = (request, response) => {
    response.render('campgrounds/New', { title: "New Campground", categories: dbCategories, category: false, places: "", campground: "" });
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
        // Find accurate location of campground. (Second Page)
        return response.render('campgrounds/New', { title: "New Campground", categories: dbCategories, category: false, places: geoData.body.features, campground });
    } else {
        campground.location = campground.accurateLocation;
        campground.geometry = geoData.body.features.find(function (place) {
            return place.place_name === campground.accurateLocation;
        }).geometry;
    }
    if (!campground.categories) {
        // Find campground categories. (Third Page)
        return response.render('campgrounds/New', { title: "New Campground", categories: dbCategories, category: true, places: geoData.body.features, campground });
    }
    // Campground added on...
    campground.addedOn = new Date();
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
    response.render('campgrounds/Show', { title: campground.title, categories: dbCategories, campground });
}

// Index --> Display all campgrounds.
module.exports.allCampgrounds = async (request, response, next) => {
    let { page, limit, select, find } = (request.query);
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 12;
    select = select ? select : "all";
    find = find ? find : "premier";
    let error = false, title = "", selectedCampgrounds = {}, campgrounds = { page, limit, select, find };
    const startIndex = (page - 1) * limit, endIndex = page * limit;
    const allFinds = ['premier', 'latest'];
    const allSelects = ['all', 'rv', 'tent', 'backcountry', 'cabin', 'beach', 'desert', 'forest', 'mountain', 'lakefront', 'family', 'luxury', 'economic', 'pet-friendly', 'adventure', 'educational', 'hunting', 'festival'];
    if (!allSelects.includes(select) || !allFinds.includes(find)) {
        // ERROR HANDLED: CATEGORY DOESN'T EXISTS
        return next(new ApplicationError("Sorry!, Invalid Category. We couldn't find the campgrounds!!", 'Invalid Category', 400));
    } else {
        // FETCH CAMPGROUNDS BASED ON SELECT
        campgrounds.results = [];
        if (select === "all") {
            title = "All Campgrounds";
            selectedCampgrounds = await Campground.find({}).populate('author');
            campgrounds.results = selectedCampgrounds.slice(startIndex, endIndex);
        } else {
            title = `${select} Based Campgrounds`.toUpperCase();
            for (category in dbCategories) {
                const { key, values } = dbCategories[category];
                for (let value of values) {
                    if (select === value) {
                        const query = {};
                        query[`categories.${key}`] = value;
                        selectedCampgrounds = await Campground.find(query).populate('author');
                        campgrounds.results = selectedCampgrounds.slice(startIndex, endIndex);
                    }
                }
            }
        }
    }
    if (campgrounds.results.length) {
        response.render('campgrounds/Index', { title, total: selectedCampgrounds.length, current: campgrounds, campgrounds: campgrounds.results, error });
    } else {
        error = true;
        response.render('campgrounds/Index', { title: "No Campgrounds", error });
    }
}

// Categories --> Display specific campgrounds.
module.exports.categoriseCampgrounds = async (request, response, next) => {
    let campgrounds = {};
    const { category } = request.query;
    if (!((Object.keys(dbCategories)).includes(category))) {
        // ERROR HANDLED: CATEGORY DOESN'T EXISTS
        return next(new ApplicationError("Sorry!, Invalid Category. We couldn't find the campgrounds!!", 'Invalid Category', 400));
    } else {
        // FETCH CAMPGROUNDS BASED ON CATEGORY
        let { key, values } = dbCategories[category];
        campgrounds.results = [];
        for (let value of values) {
            const query = {};
            query[`categories.${key}`] = value;
            const resultCampgrounds = {};
            resultCampgrounds.select = value;
            resultCampgrounds.heading = (value + " based campgrounds").toUpperCase();
            resultCampgrounds.content = await Campground.find(query).populate('author');
            resultCampgrounds.length = resultCampgrounds.content.length;
            campgrounds.results.push(resultCampgrounds);
        }
    }
    if (campgrounds.results.length) {
        response.render('campgrounds/Categories', { title: `Campground ${category}`, campgroundResults: campgrounds.results });
    } else {
        response.render('campgrounds/NotFound', { title: "No Campgrounds" });
    }
}

// UPDATE OPERATION ROUTES

// Edit --> Form to edit a campground.
module.exports.renderEditForm = async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findById(id).populate('author');
    response.render('campgrounds/Edit', { title: "Edit Campground", categories: dbCategories, category: false, places: "", campground });
}

// Update --> Updates a campground on server.
module.exports.updateCampground = async (request, response, next) => {
    let { id, campground } = request.body;
    const oldCampground = await Campground.findById(id);
    const geoData = await geoCoder.forwardGeocode({
        query: campground.location
    }).send();
    if (!campground.accurateLocation) {
        // Find accurate location of campground. (Second Page)
        Object.assign(oldCampground, campground);
        return response.render('campgrounds/Edit', { title: "Edit Campground", categories: dbCategories, category: false, places: geoData.body.features, campground: oldCampground });
    } else if (!campground.categories) {
        campground.location = campground.accurateLocation;
        campground.geometry = geoData.body.features.find(function (place) {
            return place.place_name === campground.accurateLocation;
        }).geometry;
        // Find campground categories. (Third Page)
        Object.assign(oldCampground, campground);
        return response.render('campgrounds/Edit', { title: "Edit Campground", categories: dbCategories, category: true, places: geoData.body.features, campground: oldCampground });
    }
    // Campground added on...
    campground.addedOn = oldCampground.addedOn;
    campground.geometry = oldCampground.geometry;
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
        Object.assign(oldCampground.categories, campground.categories);
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
    response.render('campgrounds/Remove', { title: "Remove Campground", categories: dbCategories, campground });
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