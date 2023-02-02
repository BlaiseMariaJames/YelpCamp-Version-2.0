// REQUIRING EXPRESS, PASSPORT AND CLOUDINARY STORAGE
const express = require("express");
const passport = require("passport");
const { storage } = require("../utilities/Cloudinary/Cloudinary Configuration.js");

// MULTER CONFIGURATION
const multer = require("multer");
const upload = multer({ storage });

// CREATING ROUTER INSTANCE 
const router = express.Router();

// REQUIRING USER CONTROLLER
const User = require("../controllers/User Controller");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("../utilities/Error Handling/Async Error Handling Middleware Function.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHECK IF USER IS LOGGED IN 
const isLoggedIn = require("../utilities/Authentication/Check If Logged In.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHECK IF ANY USER IS ALREADY LOGGED IN 
const isAlreadyLoggedIn = require("../utilities/Authentication/Check If Already Logged In.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHECK IF ANY USER IS ALREADY LOGGED OUT
const isAlreadyLoggedOut = require("../utilities/Authentication/Check If Already Logged Out.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHECK IF PASSWORD PROVIDED IN EDIT PROFILE IS VALID
const isValidPassword = require("../utilities/Authentication/Check If Valid Password.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHANGE CURRENT PASSWORD
const changePassword = require("../utilities/Authentication/Change Password.js");

// RESPONDING TO THE SERVER AT USER MODEL BASED ROUTE

router.route('/register')
    .get(isAlreadyLoggedIn, User.renderRegisterForm)
    .post(isAlreadyLoggedIn, upload.single('image'), handleAsyncErrors(User.createUser));

router.route('/login')
    .get(isAlreadyLoggedIn, User.renderLoginForm)
    .post(isAlreadyLoggedIn, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), User.authenticateUser);

router.route('/profile')
    .get(isLoggedIn, User.viewProfile)
    .patch(isLoggedIn, upload.single('image'), handleAsyncErrors(isValidPassword), handleAsyncErrors((req, res, next) => changePassword(req, res, next, false)), handleAsyncErrors(User.updateProfile));

router.route('/forgot-password')
    .get(User.renderForgotPasswordForm)
    .patch(User.forgotPassword);

router.route('/reset-password/:token')
    .get(User.renderResetPasswordForm)
    .patch(handleAsyncErrors(User.resetPassword));

router.post('/logout', isAlreadyLoggedOut, User.logoutUser);

// EXPORTING ROUTER INSTANCE
module.exports = router;