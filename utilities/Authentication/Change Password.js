// REQUIRING USER SCHEMA
const UserSchema = require("../../models/Joi Models/User Model.js");

// REQUIRING APPLICATION ERROR HANDLER CLASS (AS FLASH ISN'T WORKING WE ARE FORCED TO THROW ERROR)
const ApplicationError = require("../Error Handling/Application Error Handler Class.js");

// REQUIRING FUNCTION TO DELETE PROFILE IMAGE FROM CLOUDINARY (IF IN CASE OF ANY ERROR WHILE UPLOADING)
const deleteProfileImage = require("../Cloudinary/Delete Cloudinary Images");

// DEFINING MIDDLEWARE FUNCTION TO CHANGE CURRENT PASSWORD
async function changePassword(request, response, next) {
    const { password, newPassword, confirmPassword } = request.body;
    if ((newPassword && !confirmPassword) || (!newPassword && confirmPassword)) {
        // Passwords don't match, redirect to error page.
        if (request.file && request.file.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
            // delete uploaded cloudinary image.
            deleteProfileImage([request.file]);
        }
        return next(new ApplicationError("New and confirm passwords must match!", "Passwords don't match", 400));
    } else if (newPassword && confirmPassword) {
        // Change current password.
        const { user } = response.locals;
        const { username, name, email } = user._doc;
        const { error } = UserSchema.validate({ username, name, email, password, newPassword, confirmPassword });
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
        if (newPassword === confirmPassword) {
            await user.setPassword(newPassword);
            next();
        } else {
            // Passwords don't match, redirect to error page.
            if (request.file && request.file.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
                // delete uploaded cloudinary image.
                deleteProfileImage([request.file]);
            }
            return next(new ApplicationError("New and confirm passwords must match!", "Passwords don't match", 400));
        }
    } else {
        next();
    }
}

module.exports = changePassword;