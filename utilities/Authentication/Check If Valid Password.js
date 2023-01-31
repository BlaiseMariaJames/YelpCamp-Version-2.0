// REQUIRING USER MODEL
const User = require("../../models/Mongoose Models/User Model.js");

// REQUIRING APPLICATION ERROR HANDLER CLASS (AS FLASH ISN'T WORKING WE ARE FORCED TO THROW ERROR)
const ApplicationError = require("../Error Handling/Application Error Handler Class.js");

// REQUIRING FUNCTION TO DELETE PROFILE IMAGE FROM CLOUDINARY (IF IN CASE OF ANY ERROR WHILE UPLOADING)
const deleteProfileImage = require("../Cloudinary/Delete Cloudinary Images");

// DEFINING MIDDLEWARE FUNCTION TO CHECK IF PASSWORD PROVIDED IN EDIT PROFILE IS VALID
async function checkIfValidPassword(request, response, next) {
    const { username } = request.user;
    const { password } = request.body;
    const { user } = await User.authenticate()(username, password);
    if (user) {
        // Valid User, store user to response.locals.
        response.locals.user = user;
        next();
    } else {
        // Invalid User, redirect to error page.
        if (request.file && request.file.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
            // delete uploaded cloudinary image.
            deleteProfileImage([request.file]);
        }
        return next(new ApplicationError('Invalid Current Password!', "Invalid Login", 400));
    }
}

module.exports = checkIfValidPassword;