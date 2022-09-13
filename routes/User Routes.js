// REQUIRING EXPRESS AND PASSPORT
const express = require("express");
const passport = require("passport");

// CREATING ROUTER INSTANCE 
const router = express.Router();

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../utilities/Application Error Handler Class.js");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("../utilities/Async Error Handling Middleware Function.js");

// REQUIRING USER MODEL AND SCHEMA
const User = require("../models/Mongoose Models/User Model.js");
const UserSchema = require("../models/Joi Models/User Model.js");

// RESPONDING TO THE SERVER AT USER MODEL BASED ROUTE

// Register --> Form to register a new user.
router.get('/register', (request, response) => {
    response.render('users/Register', { title: "Register" });
});

// Create --> Create a new user account.
router.post('/register', handleAsyncErrors(async (request, response) => {
    const { username, email, password } = request.body;
    const { error } = UserSchema.validate(request.body);
    // IF ANY SCHEMATIC ERROR
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Cannot create user account, ${errorMessage}.`);
        return response.status(400).redirect('/register');
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    }
    const newUser = new User({ username, email });
    try {
        await User.register(newUser, password);
    }
    // IF ANY PASSPORT-LOCAL-MONGOOSE ERROR
    catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.email) {
            // Below two lines of code will redirect to the same page and make user aware of errors.
            request.flash('error', "Cannot create user account, A user with the given email is already registered.");
            return response.status(400).redirect('/register');
            // Use below code to redirect to Error Page and make user aware of errors.
            // return next(new ApplicationError("Cannot create user account, A user with the given email is already registered.", "Bad Request", 400));
        }
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Cannot create user account, ${error.message}.`);
        return response.status(400).redirect('/register');
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(error.message, "Bad Request", 400));
    }
    request.flash('success', 'Successfully created a new user account!');
    response.redirect(`/campgrounds`);
}));

// Login --> Form to login a user.
router.get('/login', (request, response) => {
    response.render('users/Login', { title: "Login" });
});

// Authenticate --> Authenticate a user.
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (request, response) => {
    request.flash('success', 'Welcome Back!');
    response.redirect('/campgrounds');
});

// EXPORTING ROUTER INSTANCE
module.exports = router;