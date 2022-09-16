// DEFINING MIDDLEWARE FUNCTION TO CHECK IF NO USER IS LOGGED IN
function checkIfNotLoggedIn(request, response, next) {
    if (!request.isAuthenticated()) {
        request.session.returnTo = request.originalUrl;
        request.flash('error', 'Please Login to Continue!');
        return response.redirect('/login');
    }
    next();
}

module.exports = checkIfNotLoggedIn;