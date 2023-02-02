// DEFINING MIDDLEWARE FUNCTION TO CHECK IF ANY USER IS ALREADY LOGGED IN
function checkIfLoggedIn(request, response, next) {
    if (request.isAuthenticated()) {
        request.flash('success', 'You are already logged in!');
        return response.redirect('/profile');
    }
    next();
}

module.exports = checkIfLoggedIn;