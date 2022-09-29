// REQUIRING EXPRESS AND PASSPORT
const express = require("express");
const passport = require("passport");

// CREATING ROUTER INSTANCE 
const router = express.Router();

// REQUIRING USER CONTROLLER
const User = require("../controllers/User Controller");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("../utilities/Error Handling/Async Error Handling Middleware Function.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHECK IF ANY USER IS ALREADY LOGGED IN 
const isAlreadyLoggedIn = require("../utilities/Authentication/Check If Already Logged In.js");

// REQUIRING MIDDLEWARE FUNCTION TO CHECK IF ANY USER IS ALREADY LOGGED OUT
const isAlreadyLoggedOut = require("../utilities/Authentication/Check If Already Logged Out.js");

// RESPONDING TO THE SERVER AT USER MODEL BASED ROUTE

router.route('/register')
    .get(isAlreadyLoggedIn, User.renderRegisterForm)
    .post(isAlreadyLoggedIn, handleAsyncErrors(User.createUser));

router.route('/login')
    .get(isAlreadyLoggedIn, User.renderLoginForm)
    .post(isAlreadyLoggedIn, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), User.authenticateUser);

router.post('/logout', isAlreadyLoggedOut, User.logoutUser);

// EXPORTING ROUTER INSTANCE
module.exports = router;