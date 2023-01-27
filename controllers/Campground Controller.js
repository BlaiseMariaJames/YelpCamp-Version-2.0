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

// REQUIRING USER MODEL
const User = require("../models/Mongoose Models/User Model.js");

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
    response.render('campgrounds/New', { title: "New Campground", categories: dbCategories, categoryAvailable: false, places: "", campground: "", current: "", category: "" });
}

// Create Campground Route Handler Closure.
const createCampgroundHandler = () => {
    let newCampgroundData = {}; // Create a persistent data variable.
    return async (request, response, next) => {
        let { campground } = request.body;
        Object.assign(newCampgroundData, campground);
        if (!newCampgroundData.accurateLocation) {
            newCampgroundData.geoData = await geoCoder.forwardGeocode({
                query: campground.location
            }).send();
            // Find accurate location of campground. (Second Page)
            return response.render('campgrounds/New', { title: "New Campground", categories: dbCategories, categoryAvailable: false, places: newCampgroundData.geoData.body.features, campground, current: "", category: "" });
        } else if (!newCampgroundData.categories) {
            // Find campground categories. (Third Page)
            newCampgroundData.images = request.files.map(file => ({ url: file.path, filename: file.filename }));
            return response.render('campgrounds/New', { title: "New Campground", categories: dbCategories, categoryAvailable: true, places: newCampgroundData.geoData.body.features, campground, current: "", category: "" });
        }
        newCampgroundData.author = request.user._id.toString();
        newCampgroundData.location = newCampgroundData.accurateLocation;
        newCampgroundData.geometry = newCampgroundData.geoData.body.features.find(function (place) {
            return place.place_name === newCampgroundData.accurateLocation;
        }).geometry;
        newCampgroundData.addedOn = new Date();
        newCampgroundData.avgRating = 0;
        delete newCampgroundData.geoData; // Delete geodata from the persistent data variable.
        const { error } = CampgroundSchema.validate(newCampgroundData);
        if (error) {
            let errorMessage = error.details.map(error => error.message).join(',');
            if (request.files) {
                // delete uploaded cloudinary images.
                deleteCampgroundImages(request.files);
            }
            // Below two lines of code will redirect to the same page and make the user aware of errors.
            request.flash('error', `Cannot create campground, ${errorMessage}.`);
            response.status(400).redirect('/campgrounds/new');
        } else {
            newCampgroundData.title = newCampgroundData.title.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            newCampgroundData.location = newCampgroundData.location.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            newCampgroundData.accurateLocation = newCampgroundData.accurateLocation.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            newCampgroundData.price = newCampgroundData.price.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            newCampgroundData.description = newCampgroundData.description.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            const newCampground = new Campground(newCampgroundData);
            newCampgroundData = {}; // Delete the persistent data variable.
            await newCampground.save();
            request.flash('success', 'Successfully created a new Campground!');
            response.redirect(`/campgrounds/${newCampground._id}`);
        }
    };
};

// Create --> Creates new campground on server.
module.exports.createCampground = createCampgroundHandler();

// READ OPERATION ROUTES

// Show --> Details for one specific campground.
module.exports.showCampground = async (request, response, next) => {
    const { id } = request.params;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    const floorRating = campground.calculateAvgRating();
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    response.render('campgrounds/Show', { title: campground.title, floorRating, number: campground.reviews.length, categories: dbCategories, campground, current: "", category: "" });
}

// Index --> Display all campgrounds.
module.exports.allCampgrounds = async (request, response, next) => {
    let { page, limit, select, find, user } = request.query;
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 12;
    user = user ? user : false;
    select = user ? false : (select ? select : false);
    find = (user || select) ? false : (find ? find : "latest");
    if ((user || select || find != "latest") && !request.isAuthenticated()) {
        request.session.returnTo = request.originalUrl;
        request.flash('error', 'Please Login to Continue!');
        return response.redirect('/login');
    }
    let error = false, title = "", username = "", userFound = {}, allCampgrounds = {}, campgrounds = { page, limit, user, select, find, results: {} };
    const startIndex = (page - 1) * limit, endIndex = page * limit;
    const options = {
        "Latest": { sortBy: "latest", sortFunction: (a, b) => b.addedOn - a.addedOn },
        "Earliest": { sortBy: "earliest", sortFunction: (a, b) => a.addedOn - b.addedOn },
        "Top Rated": { sortBy: "top-rated", sortFunction: (a, b) => b.avgRating - a.avgRating },
        "Premium": { sortBy: "premium", sortFunction: (a, b) => b.price - a.price },
        "Economic": { sortBy: "economic", sortFunction: (a, b) => a.price - b.price },
        "Title [A-Z]": { sortBy: "title-asc", sortFunction: (a, b) => a.title.localeCompare(b.title) },
        "Title [Z-A]": { sortBy: "title-desc", sortFunction: (a, b) => b.title.localeCompare(a.title) },
        "Location [A-Z]": { sortBy: "location-asc", sortFunction: (a, b) => a.location.localeCompare(b.location) },
        "Location [Z-A]": { sortBy: "location-desc", sortFunction: (a, b) => b.location.localeCompare(a.location) }
    };
    const allFinds = ['latest', 'earliest', 'top-rated', 'premium', 'economic', 'title-asc', 'title-desc', 'location-asc', 'location-desc', false];
    const allSelects = ['rv', 'tent', 'backcountry', 'cabin', 'beach', 'desert', 'forest', 'mountain', 'lakefront', 'family', 'luxury', 'economic', 'pet-friendly', 'adventure', 'educational', 'hunting', 'festival', false];
    user && (userFound = await User.findOne({ username: user }));
    if (user && !userFound) {
        // ERROR HANDLED: USER DOESN'T EXISTS
        return next(new ApplicationError("Sorry!, Invalid User ID. We couldn't find the campgrounds!!", 'Invalid User ID', 400));
    } else if (!allSelects.includes(select) || !allFinds.includes(find)) {
        // ERROR HANDLED: CATEGORY OR FIND DOESN'T EXISTS
        return next(new ApplicationError("Sorry!, Invalid Category. We couldn't find the campgrounds!!", 'Invalid Category', 400));
    } else {
        let paginatedCampgrounds = [];
        if (find) {
            // FETCH CAMPGROUNDS FOR A SPECIFIC FIND (Latest, Earliest, Top Rated, ...)
            let sortFunction;
            for (const option in options) {
                if (options[option].sortBy === find) {
                    sortFunction = options[option].sortFunction;
                    title = `${option} Campgrounds`;
                }
            }
            // Find, sort then paginate.
            allCampgrounds = await Campground.find({}).sort([["addedOn", -1]]).populate('author');
            allCampgrounds.sort(sortFunction);
            paginatedCampgrounds = allCampgrounds.slice(startIndex, endIndex);
            campgrounds.results.latest = paginatedCampgrounds;
        } else if (user) {
            // FETCH CAMPGROUNDS FOR ALL FINDS (Campgrounds of specific user)
            username = `${userFound.name}`;
            title = `${userFound.name} @(${userFound.username})`;
            for (let option in options) {
                let paginatedCampgrounds = [], query = {};
                const { sortBy, sortFunction } = options[option];
                query["author"] = userFound._id;
                allCampgrounds = await Campground.find(query).populate('author');
                paginatedCampgrounds = allCampgrounds.slice(startIndex, endIndex);
                // Find, paginate then sort.
                paginatedCampgrounds.sort(sortFunction);
                campgrounds.results[sortBy] = paginatedCampgrounds;
            }
        } else {
            // FETCH CAMPGROUNDS FOR ALL FINDS (Campgrounds of specific category)
            title = `${select} Based Campgrounds`.toUpperCase();
            for (let option in options) {
                const { sortBy, sortFunction } = options[option];
                // FETCH CAMPGROUNDS FOR A SPECIFIC SELECT (RV based, Tent based, ...)
                for (const category in dbCategories) {
                    const { key, values } = dbCategories[category];
                    for (const value of values) {
                        if (select === value) {
                            const query = {};
                            query[`categories.${key}`] = value;
                            allCampgrounds = await Campground.find(query).populate('author');
                            paginatedCampgrounds = allCampgrounds.slice(startIndex, endIndex);
                        }
                    }
                }
                // Find, paginate then sort.
                paginatedCampgrounds.sort(sortFunction);
                campgrounds.results[sortBy] = paginatedCampgrounds;
            }
        }
    }
    if (campgrounds.results.latest.length) {
        response.render('campgrounds/Index', { title, username, total: allCampgrounds.length, current: campgrounds, campgrounds: campgrounds.results, error, category: "" });
    } else {
        error = true;
        response.render('campgrounds/Index', { title: "No Campgrounds", error, current: "", category: "" });
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
            resultCampgrounds.content = await Campground.find(query).sort([["addedOn", -1]]).populate('author');
            resultCampgrounds.length = resultCampgrounds.content.length;
            campgrounds.results.push(resultCampgrounds);
        }
    }
    if (campgrounds.results.length) {
        response.render('campgrounds/Categories', { title: `Campground ${category}`, campgroundResults: campgrounds.results, current: "", category: category });
    } else {
        response.render('campgrounds/NotFound', { title: "No Campgrounds", current: "", category: "" });
    }
}

// UPDATE OPERATION ROUTES

// Edit --> Form to edit a campground.
module.exports.renderEditForm = async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findById(id).populate('author');
    response.render('campgrounds/Edit', { title: "Edit Campground", categories: dbCategories, categoryAvailable: false, places: "", campground, current: "", category: "" });
}

// Update Campground Route Handler Closure.
const updateCampgroundHandler = () => {
    let editCampgroundData = {}; // Create a persistent data variable.
    return async (request, response, next) => {
        let { id, campground } = request.body;
        let oldCampground = await Campground.findById(id);
        Object.assign(editCampgroundData, campground);
        if (!editCampgroundData.accurateLocation) {
            editCampgroundData.geoData = await geoCoder.forwardGeocode({
                query: campground.location
            }).send();
            // Find accurate location of campground. (Second Page)
            return response.render('campgrounds/Edit', { title: "Edit Campground", categories: dbCategories, categoryAvailable: false, places: editCampgroundData.geoData.body.features, campground: oldCampground, current: "", category: "" });
        } else if (!editCampgroundData.categories) {
            // Find campground categories. (Third Page)
            return response.render('campgrounds/Edit', { title: "Edit Campground", categories: dbCategories, categoryAvailable: true, places: editCampgroundData.geoData.body.features, campground: oldCampground, current: "", category: "" });
        }
        editCampgroundData.location = editCampgroundData.accurateLocation;
        editCampgroundData.geometry = editCampgroundData.geoData.body.features.find(function (place) {
            return place.place_name === editCampgroundData.accurateLocation;
        }).geometry;
        // Copy unchanged properties from oldCampground to editCampgroundData.
        let oldCampgroundObj = oldCampground.toObject();
        delete editCampgroundData.geoData;  // Delete geodata from the persistent data variable.
        Object.assign(oldCampgroundObj, editCampgroundData);
        let { author, images, addedOn, avgRating } = oldCampgroundObj;
        editCampgroundData.author = author;
        editCampgroundData.images = images;
        editCampgroundData.addedOn = addedOn;
        editCampgroundData.avgRating = avgRating;
        const { error } = CampgroundSchema.validate(editCampgroundData);
        if (error) {
            let errorMessage = error.details.map(error => error.message).join(',');
            // Below two lines of code will redirect to the same page and make user aware of errors.
            request.flash('error', `Cannot edit campground, ${errorMessage}.`);
            response.status(400).redirect(`/campgrounds/${id}/edit`);
        } else {
            oldCampgroundObj.title = oldCampgroundObj.title.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            oldCampgroundObj.location = oldCampgroundObj.location.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            oldCampgroundObj.accurateLocation = oldCampgroundObj.accurateLocation.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            oldCampgroundObj.price = oldCampgroundObj.price.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            oldCampgroundObj.description = oldCampgroundObj.description.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            await Campground.updateOne({ _id: id }, oldCampgroundObj);
            editCampgroundData = {}; // Delete the persistent data variable.
            request.flash('success', 'Successfully edited the Campground!');
            response.redirect(`/campgrounds/${oldCampground._id}`);
        }
    };
};

// Update --> Updates a campground on server.
module.exports.updateCampground = updateCampgroundHandler();

// Manage --> Form to manage campground images.
module.exports.renderManageForm = async (request, response) => {
    const { id } = request.params;
    const campground = await Campground.findById(id).populate('author');
    response.render('campgrounds/Manage', { title: "Manage Campground Images", campground, current: "", category: "" });
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
    response.render('campgrounds/Remove', { title: "Remove Campground", categories: dbCategories, campground, current: "", category: "" });
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