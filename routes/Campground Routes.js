// REQUIRING EXPRESS AND CLOUDINARY STORAGE
const express = require("express");
const { storage } = require("../utilities/Cloudinary/Cloudinary Configuration.js");

// MULTER CONFIGURATION
const multer = require("multer");
const upload = multer({ storage });

// CREATING ROUTER INSTANCE
const router = express.Router();

// REQUIRING CAMPGROUND CONTROLLER
const Campground = require("../controllers/Campground Controller");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("../utilities/Error Handling/Async Error Handling Middleware Function.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHECK IF USER IS LOGGED IN 
const isLoggedIn = require("../utilities/Authentication/Check If Logged In.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHECK IF CAMPGROUND ID IS VALID, CAMPGROUND EXISTS AND CURRENT USER IS AUTHORIZED
const isAuthorized = require("../utilities/Authorization/Check If Is Authorized For Campground.js");

// REQUIRING MIDDLEWARE FUNCTION THAT ADDS VARIOUS MONGODB QUERIES BASED ON VARIOUS KEYS PRESENT IN THE SEARCH QUERY
const searchAndFilter = require("../utilities/Others/Search & Filter.js");

// RESPONDING TO THE SERVER AT CAMPGROUND MODEL BASED ROUTE

router.route('/')
    .get(handleAsyncErrors(searchAndFilter), handleAsyncErrors(Campground.allCampgrounds))
    .post(isLoggedIn, upload.array('campground[images]'), handleAsyncErrors(Campground.createCampground))
    .put(isLoggedIn, upload.array('campground[images]'), isAuthorized, handleAsyncErrors(Campground.redesignCampground))
    .patch(isLoggedIn, isAuthorized, handleAsyncErrors(Campground.updateCampground))
    .delete(isLoggedIn, isAuthorized, handleAsyncErrors(Campground.deleteCampground));

router.get('/new', isLoggedIn, Campground.renderNewForm);
router.get('/categories', isLoggedIn, handleAsyncErrors(Campground.categoriseCampgrounds));
router.get('/:id', isLoggedIn, handleAsyncErrors(Campground.showCampground));
router.get('/:id/manage', isLoggedIn, isAuthorized, handleAsyncErrors(Campground.renderManageForm));
router.get('/:id/edit', isLoggedIn, isAuthorized, handleAsyncErrors(Campground.renderEditForm));
router.get('/:id/remove', isLoggedIn, isAuthorized, handleAsyncErrors(Campground.renderRemoveForm));

// EXPORTING ROUTER INSTANCE
module.exports = router;