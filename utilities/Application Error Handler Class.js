// DEFINING APPLICATION ERROR HANDLER CLASS
class ApplicationError extends Error {

    /* DEFAULT PARAMETERS FOR HANDLING DEFAULT ERRORS
    
    statusCode   = 500,
    title        = Internal Server Error,
    description  = Sorry, we have a problem at the server side and couldn't figure it out!
    
    */

    constructor(description = "Sorry, we have a problem at the server side and couldn't figure it out!", title = 'Internal Server Error', statusCode = 500) {
        super();
        this.title = title;
        this.statusCode = statusCode;
        this.description = description;
    }
}

module.exports = ApplicationError;