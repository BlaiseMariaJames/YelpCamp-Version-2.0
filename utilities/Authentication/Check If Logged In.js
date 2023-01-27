// DEFINING MIDDLEWARE FUNCTION TO CHECK IF USER IS LOGGED IN 
function checkIfLoggedIn(request, response, next) {
    if (!request.isAuthenticated()) {
        request.session.returnTo = request.originalUrl;
        request.flash('error', 'Please Login to Continue!');
        return response.redirect('/login');
    }
    next();
}

module.exports = checkIfLoggedIn;