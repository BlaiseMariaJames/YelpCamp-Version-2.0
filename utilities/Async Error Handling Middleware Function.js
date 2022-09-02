// REQUIRING APPLCATION ERROR HANDLER CLASS 
const ApplicationError = require("./Application Error Handler Class");

// DEFINING FUNCTION THAT WRAPS AROUND ASYNC FUNCTIONS TO HANDLE ITS ERRORS (IF ANY)
function handleAsyncErrors(async_function) {

    // Function to return the same passed asynchronous function along with a catch block.
    return function (request, response, next) {
        async_function(request, response, next).catch(error => next(new ApplicationError(error.message, error.name)));
    }
}

module.exports = handleAsyncErrors;