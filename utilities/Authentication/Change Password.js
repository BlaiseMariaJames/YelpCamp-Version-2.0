// REQUIRING PASSWORD SCHEMA
const PasswordSchema = require("../../models/Joi Models/Password Model.js");

// REQUIRING APPLICATION ERROR HANDLER CLASS (AS FLASH ISN'T WORKING WE ARE FORCED TO THROW ERROR)
const ApplicationError = require("../Error Handling/Application Error Handler Class.js");

// REQUIRING FUNCTION TO DELETE PROFILE IMAGE FROM CLOUDINARY (IF IN CASE OF ANY ERROR WHILE UPLOADING)
const deleteProfileImage = require("../Cloudinary/Delete Cloudinary Images");

// DEFINING MIDDLEWARE FUNCTION TO CHANGE CURRENT PASSWORD
async function changePassword(request, response, next, isResetPassword) {
    const { newPassword, confirmPassword } = request.body;
    if ((newPassword && !confirmPassword) || (!newPassword && confirmPassword) || (isResetPassword && (!newPassword && !confirmPassword))) {
        // Passwords don't match or are empty in case of reset password form, redirect to error page.
        if (request.file && request.file.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
            // delete uploaded cloudinary image.
            deleteProfileImage([request.file]);
        }
        response.locals.invalidPasswords = { message: "New and confirm passwords must match!", name: "Passwords don't match" };
        const { message, name } = response.locals.invalidPasswords;
        if (isResetPassword) throw new ApplicationError(message, name, 400);
        return next(new ApplicationError(message, name, 400));
    } else if (newPassword && confirmPassword) {
        // Change current password.
        const { user } = response.locals;
        const { error } = PasswordSchema.validate({ newPassword, confirmPassword });
        // IF ANY SCHEMATIC ERROR
        if (error) {
            let errorMessage = error.details.map(error => error.message).join(',');
            if (request.file && request.file.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
                // delete uploaded cloudinary image.
                deleteProfileImage([request.file]);
            }
            // Use below code to redirect to Error Page and make user aware of errors.
            errorMessage = isResetPassword ? `Cannot reset user password, ${errorMessage}. Please Try Again!` : `Cannot edit user profile, ${errorMessage}. Please Try Again!`;
            response.locals.invalidPasswords = { message: errorMessage, name: "Bad Request" };
            const { message, name } = response.locals.invalidPasswords;
            if (isResetPassword) throw new ApplicationError(message, name, 400);
            return next(new ApplicationError(message, name, 400));
        }
        if (newPassword === confirmPassword) {
            if (response.locals.invalidPasswords) response.locals.invalidPasswords = null;
            await user.setPassword(newPassword);
            if (isResetPassword) return;
            next();
        } else {
            // Passwords don't match, redirect to error page.
            if (request.file && request.file.filename !== "YelpCamp Related Media/cga1fohb5tqspkkchdzd") {
                // delete uploaded cloudinary image.
                deleteProfileImage([request.file]);
            }
            response.locals.invalidPasswords = { message: "New and confirm passwords must match!", name: "Passwords don't match" };
            const { message, name } = response.locals.invalidPasswords;
            if (isResetPassword) throw new ApplicationError(message, name, 400);
            return next(new ApplicationError(message, name, 400));
        }
    } else {
        if (response.locals.invalidPasswords) response.locals.invalidPasswords = null;
        if (isResetPassword) return;
        next();
    }
}

module.exports = changePassword;