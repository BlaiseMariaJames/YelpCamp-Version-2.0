// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../utilities/Application Error Handler Class.js");

// REQUIRING USER MODEL AND SCHEMA
const User = require("../models/Mongoose Models/User Model.js");
const UserSchema = require("../models/Joi Models/User Model.js");

// Register --> Form to register a new user.
module.exports.renderRegisterForm = (request, response) => {
    response.render('users/Register', { title: "Register" });
}

// Create --> Create a new user account.
module.exports.createUser = async (request, response, next) => {
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
        const registeredUser = await User.register(newUser, password);
        request.login(registeredUser, function (error) {
            if (error) {
                return next(new ApplicationError(error.message, error.name));
            }
            request.flash('success', 'Successfully created a new user account!');
            response.redirect(`/campgrounds`);
        });
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
}

// Login --> Form to login a user.
module.exports.renderLoginForm = (request, response) => {
    response.render('users/Login', { title: "Login" });
}

// Authenticate --> Authenticate a user.
module.exports.authenticateUser = (request, response) => {
    request.flash('success', 'Welcome Back!');
    const redirectUrl = request.session.returnTo || '/campgrounds';
    delete request.session.returnTo;
    response.redirect(redirectUrl);
}

// Logout --> Logout a user.
module.exports.logoutUser = (request, response, next) => {
    request.logout(function (error) {
        if (error) {
            return next(new ApplicationError(error.message, error.name));
        }
        request.flash('success', 'Goodbye!');
        response.redirect('/campgrounds');
    });
}