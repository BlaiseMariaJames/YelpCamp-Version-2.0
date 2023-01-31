// REQUIRING USER MODEL AND SCHEMA
const User = require("../models/Mongoose Models/User Model.js");
const UserSchema = require("../models/Joi Models/User Model.js");

// REQUIRING CAMPGROUND MODEL
const Campground = require("../models/Mongoose Models/Campground Model.js");

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../utilities/Error Handling/Application Error Handler Class.js");

// REQUIRING UTIL HELPER MODULE FROM NODE
const util = require("util");

// REQUIRING FUNCTION TO DELETE PROFILE IMAGE FROM CLOUDINARY (IF IN CASE OF ANY ERROR WHILE UPLOADING)
const deleteProfileImage = require("../utilities/Cloudinary/Delete Cloudinary Images");

// Register --> Form to register a new user.
module.exports.renderRegisterForm = (request, response) => {
    response.render('users/Register', { title: "Register", current: "", category: "" });
}

// Create --> Create a new user account.
module.exports.createUser = async (request, response, next) => {
    let image = { url: "https://res.cloudinary.com/dtwgxcqkr/image/upload/v1700848280/YelpCamp%20Related%20Media/cga1fohb5tqspkkchdzd.png", filename: "YelpCamp Related Media/cga1fohb5tqspkkchdzd" };
    let { username, name, email, bio, password } = request.body;
    if (request.file) {
        const { path, filename } = request.file;
        image.url = path;
        image.filename = filename;
    }
    const { error } = UserSchema.validate({ ...request.body, image });
    // IF ANY SCHEMATIC ERROR
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        if (request.file && request.file.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
            // delete uploaded cloudinary image.
            deleteProfileImage([request.file]);
        }
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Cannot create user account, ${errorMessage}.`);
        return response.status(400).redirect('/register');
    }
    username = username.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
    name = name.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
    email = email.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
    password = password.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
    const newUser = new User({ username, name, email, bio, image });
    try {
        const registeredUser = await User.register(newUser, password);
        request.login(registeredUser, function (error) {
            if (error) {
                return next(new ApplicationError(error.message, error.name));
            }
            request.flash('success', 'Successfully created a new user account!');
            response.redirect(`/profile`);
        });
    }
    // IF ANY PASSPORT-LOCAL-MONGOOSE ERROR
    catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.email) {
            // Below two lines of code will redirect to the same page and make user aware of errors.
            request.flash('error', "Cannot create user account, A user with the given email is already registered.");
            return response.status(400).redirect('/register');
        }
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Cannot create user account, ${error.message}.`);
        return response.status(400).redirect('/register');
    }
}

// Login --> Form to login a user.
module.exports.renderLoginForm = (request, response) => {
    response.render('users/Login', { title: "Login", current: "", category: "" });
}

// Authenticate --> Authenticate a user.
module.exports.authenticateUser = (request, response) => {
    request.flash('success', 'Welcome Back!');
    const redirectUrl = request.session.returnTo || '/campgrounds';
    delete request.session.returnTo;
    response.redirect(redirectUrl);
}

// View Profile --> View user profile.
module.exports.viewProfile = async (request, response, next) => {
    let { _id } = request.user;
    let campgrounds = {}, error = false;
    const user = await User.findById({ _id });
    campgrounds["latest"] = await Campground.find({ author: user._id }).sort([["addedOn", -1]]).populate('author');
    campgrounds["top-rated"] = await Campground.find({ author: user._id }).sort([["avgRating", -1]]).populate('author');
    error = (campgrounds.latest.length) ? false : true;
    response.render('users/Profile', { title: `${user.name} (@${user.username})`, user, campgrounds, error, current: "", category: "" });
}

// Update Profile --> Update user profile.
module.exports.updateProfile = async (request, response, next) => {
    const { user } = response.locals;
    const { name, bio, password, deleteImage } = request.body;
    user.name = name;
    user.bio = bio;
    // Replace image.
    if (request.file) {
        const { path, filename } = request.file;
        if (user.image.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
            deleteProfileImage([user.image]);
        }
        user.image.url = path;
        user.image.filename = filename;
    }
    // Delete image.
    if (deleteImage && user.image.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
        deleteProfileImage([user.image]);
        user.image.url = "https://res.cloudinary.com/dtwgxcqkr/image/upload/v1700848280/YelpCamp%20Related%20Media/cga1fohb5tqspkkchdzd.png";
        user.image.filename = "YelpCamp Related Media/cga1fohb5tqspkkchdzd";
    }
    const { username, email } = user._doc;
    const { error } = UserSchema.validate({ username, name, bio, email, password });
    // IF ANY SCHEMATIC ERROR
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        if (request.file && request.file.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
            // delete uploaded cloudinary image.
            deleteProfileImage([request.file]);
        }
        // Use below code to redirect to Error Page and make user aware of errors.
        return next(new ApplicationError(`Cannot edit user profile, ${errorMessage}.`, "Bad Request", 400));
    }
    await user.save();
    // Login user with updated credentials.
    const login = util.promisify(request.login.bind(request));
    await login(user);
    request.flash('success', 'Profile successfully updated');
    response.redirect('/profile');
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