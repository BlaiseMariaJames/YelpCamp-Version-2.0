// REQUIRING USER MODEL AND SCHEMA
const User = require("../models/Mongoose Models/User Model.js");
const UserSchema = require("../models/Joi Models/User Model.js");

// REQUIRING CAMPGROUND MODEL
const Campground = require("../models/Mongoose Models/Campground Model.js");

// REQUIRING CHANGE PASSWORD MIDDELWARE AND APPLICATION ERROR HANDLER CLASS 
const changePassword = require("../utilities/Authentication/Change Password.js");
const ApplicationError = require("../utilities/Error Handling/Application Error Handler Class.js");

// REQUIRING UTIL AND CRYPTO HELPER MODULES FROM NODE
const util = require("util");
const crypto = require("crypto");

// REQUIRING SEND GRID MAIL ALONG WITH ITS CONFIGURATION
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

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
        request.login(registeredUser, async function (error) {
            if (error) {
                return next(new ApplicationError(error.message, error.name));
            }
            // Send email.
            const msg = {
                to: email,
                from: 'Yelpcamp v2 Admin <helpdesk.yelpcampv2@gmail.com>',
                subject: 'Yelpcamp v2 - Welcome',
                html: "<h1>Welcome to YelpCamp!</h1><p>Dear Camper, Welcome to YelpCamp, your ultimate destination for discovering, sharing, and exploring campgrounds around the world! We're thrilled to have you join our community of outdoor enthusiasts.</p><h2>What is YelpCamp?</h2><p>YelpCamp is a platform designed for campers, nature lovers, and adventure seekers. Whether you're a seasoned camper or just starting your outdoor journey, YelpCamp is here to make your camping experience unforgettable.</p><h2>Key Features:</h2><ol><li><strong>Create Your Camping Haven:</strong> Share your favorite camping spots with the world! Easily create and showcase your own campgrounds, complete with photos, descriptions, and useful tips.</li><li><strong>Discover Hidden Gems:</strong> Explore a vast database of campgrounds worldwide. From serene lakeside retreats to rugged mountain escapes, YelpCamp helps you find the perfect spot for your next adventure.</li><li><strong>Plan Your Trip:</strong> Utilize our planning tools to organize your camping trips effortlessly. Check weather forecasts, create packing lists, and map out your route all in one place.</li><li><strong>Real User Reviews:</strong> Hear from fellow campers! Read and leave reviews to help the community find the best spots and make informed decisions about their next camping destination.</li><li><strong>Interactive Maps:</strong> Navigate with ease using our interactive maps. Locate campgrounds, nearby attractions, and essential amenities to make the most of your outdoor experience.</li><li><strong>Connect with Like-minded Campers:</strong> Join discussions, share tips, and connect with a community that shares your passion for the great outdoors. Exchange stories, recommendations, and create lasting connections.</li></ol><p>YelpCamp is more than just a platform; it's a community dedicated to making camping accessible, enjoyable, and memorable. We're excited to embark on this outdoor journey with you.</p><p>Start creating, sharing, and exploring today!</p><p>Happy Camping!</p><p>Best regards,<br>Blaise Maria James - Yelpcamp Admin,<br>The YelpCamp Team.</p>"
            };
            await sgMail.send(msg);
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
module.exports.authenticateUser = async (request, response) => {
    // Send email.
    const msg = {
        to: request.user.email,
        from: 'Yelpcamp v2 Admin <helpdesk.yelpcampv2@gmail.com>',
        subject: 'Yelpcamp v2 - New Login',
        html: "<h1>New Login to YelpCamp!</h1><p>Dear Camper,</p><p>We wanted to inform you that there has been a new login to your YelpCamp account. If this was you, no action is needed, and you can disregard this message.</p><p>If you did not initiate this login or suspect any unauthorized access, please secure your account by changing your password immediately. You can do this by visiting your account settings on the YelpCamp platform.</p><p>If you have any concerns or need further assistance, please contact our support team at helpdesk.yelpcampv2@gmail.com.</p><p>Thank you for choosing YelpCamp. We prioritize the security of your account and are here to help ensure a safe and enjoyable experience.</p><p>Best regards,<br>Blaise Maria James - Yelpcamp Admin,<br>The YelpCamp Team.</p>"
    };
    await sgMail.send(msg);
    request.flash('success', 'Welcome Back!');
    const redirectUrl = request.session.returnTo || '/profile';
    delete request.session.returnTo;
    response.redirect(redirectUrl);
}

// View Profile --> View user profile.
module.exports.viewProfile = async (request, response, next) => {
    let { _id } = request.user;
    let campgrounds = {}, error = false;
    const user = await User.findById({ _id });
    campgrounds["latest"] = await Campground.find({ author: user._id }).sort([["addedOn", -1]]).populate('author').limit(8);
    campgrounds["top-rated"] = await Campground.find({ author: user._id }).sort([["avgRating", -1]]).populate('author').limit(8);
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
    // Send email.
    const msg = {
        to: user.email,
        from: 'Yelpcamp v2 Admin <helpdesk.yelpcampv2@gmail.com>',
        subject: 'Yelpcamp v2 - Profile Updated',
        text: `Dear Camper,\n\nThis email is to confirm that your profile has been updated. If you did not make this change, please reply promptly to notify us.\n\nBest regards,\nBlaise Maria James - Yelpcamp Admin,\nThe YelpCamp Team.`
    };
    await sgMail.send(msg);
    request.flash('success', 'Profile successfully updated');
    response.redirect('/profile');
}

// Forgot Password Form --> Form to forgot password.
module.exports.renderForgotPasswordForm = (request, response, next) => {
    response.render('users/Forgot Password', { title: "Forgot Password", current: "", category: "" });
}

// Forgot Password --> Send user email.
module.exports.forgotPassword = async (request, response, next) => {
    // Generate token.
    const token = crypto.randomBytes(20).toString('hex');
    const { email } = request.body;
    const user = await User.findOne({ email });
    if (!user) {
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Invalid email or User with given email doesn't exists.`);
        return response.status(404).redirect('/forgot-password');
    }
    user.resetPasswordToken = token;
    // Reset password token expires in one hour.
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    // Send email.
    const msg = {
        to: email,
        from: 'Yelpcamp v2 Admin <helpdesk.yelpcampv2@gmail.com>',
        subject: 'Yelpcamp v2 - Forgot Password / Reset',
        text: `Dear Camper,\n\nYou are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or copy and paste it into your browser to complete the process: \n\nhttp://${request.headers.host}/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nBest regards,\nBlaise Maria James - Yelpcamp Admin,\nThe YelpCamp Team.`
    };
    await sgMail.send(msg);
    request.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
    response.redirect('/forgot-password');
}

// Reset Password Form --> Form to reset password.
module.exports.renderResetPasswordForm = async (request, response, next) => {
    const { token } = request.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Password reset token is invalid or expired.`);
        return response.status(400).redirect('/forgot-password');
    }
    response.render('users/Reset Password', { title: "Reset Password", current: "", category: "", token });
}

// Reset Password --> Reset user password.
module.exports.resetPassword = async (request, response, next) => {
    const { token } = request.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        // Below two lines of code will redirect to the same page and make user aware of errors.
        request.flash('error', `Password reset token is invalid or expired.`);
        return response.status(400).redirect('/forgot-password');
    }
    // Valid User, store user to response.locals and change password.
    response.locals.user = user;
    try {
        await changePassword(request, response, next, true);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        // Login user with updated credentials.
        const login = util.promisify(request.login.bind(request));
        await login(user);
        // Send email.
        const msg = {
            to: user.email,
            from: 'Yelpcamp v2 Admin <helpdesk.yelpcampv2@gmail.com>',
            subject: 'Yelpcamp v2 - Password Changed',
            text: `Dear Camper,\n\nThis email is to confirm that the password for your account has just been changed. If you did not make this change, please hit reply and notify us at once.\n\nBest regards,\nBlaise Maria James - Yelpcamp Admin,\nThe YelpCamp Team.`
        };
        await sgMail.send(msg);
        request.flash('success', 'Password successfully updated');
        response.redirect('/profile');
    } catch (error) {
        const { message, name } = response.locals.invalidPasswords;
        return next(new ApplicationError(message, name, 400));
    }
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