// STAGE 1: SETTING THE SERVER, VIEW ENGINE, ASSETS, SESSIONS, FORM/JSON DATA AND PATHS //

// REQUIRING NODE MODULES
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");

// STARTING THE SERVER
let portNumber = 8888;
const application = express();

// SETTING THE VIEW ENGINE, DEFAULT ENGINE BEHAVIOUR AND PATH
application.set('view engine', 'ejs');
application.engine('ejs', ejsMate);
application.set('views', path.join(__dirname, '/views'));

// PARSING JSON DATA AND FORM DATA
application.use(express.json());
application.use(express.urlencoded({ extended: true }));

// SERVING STATIC ASSETS IN EXPRESS AND SETTING THE 'PUBLIC' PATH
application.use(express.static('public'));
application.set('public', path.join(__dirname, '/public'));

// CONFIGURING SESSIONS
const sessionConfig = {
    secret: "tobedetermined",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // Expire within a week
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        // Expire within a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
application.use(session(sessionConfig));


// STAGE 2: DEFINING ERROR HANDLER, FUNCTIONS, LOGGER AND HTTP VERBS //

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("./utilities/Application Error Handler Class.js");

// FUNCTION TO START LISTENING TO THE SERVER
function startServer() {
    // LISTENING TO THE SERVER
    application.listen(portNumber, () => {
        console.log("\nStarting the server...");
        console.log(`Listening at the port ${portNumber}!`);
    });
}

// FUNCTION TO HELP MORGAN LOGGER MIDDLEWARE
function print(request, response, next) {
    console.log();
    next();
}

// USING MIDDLEWARES
application.use(flash());
application.use(print, morgan('tiny'));
application.use(methodOverride('_method'));

// DEFINING FLASH MIDDLEWARE TO FLASH SUCCESS AND ERRORS (IF ANY) AT EVERY ROUTE
application.use((request, response, next) => {
    response.locals.error = request.flash('error');
    response.locals.success = request.flash('success');
    next();
});


// STAGE 3: CONNECTING TO DATABASE //

// CONNECTING TO MONGO DATABASE USING MONGOOSE
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/campgrounds", {
    // PASSING REQUIRED OPTIONS TO AVOID DEPRECIATION WARNINGS IN FUTURE
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// VERIFYING DATABASE CONNECTION
const databaseConnection = mongoose.connection;
// If failed.
databaseConnection.on("error", console.error.bind(console, "\nError!, Couldn't connect to the database."));
// If successful.
databaseConnection.once("open", async () => {
    console.log("\nConnecting to the database...");
    console.log("We are connected to the database and are good to go!");
    startServer();
});


// STAGE 4: RESPONDING TO THE SERVER //

// CAMPGROUND MODEL BASED ROUTES

// REQUIRING CAMPGROUND ROUTES HANDLER
const campgroundRouteHandler = require("./routes/Campground Routes");
application.use('/campgrounds', campgroundRouteHandler);

// REVIEW MODEL BASED ROUTES

// REQUIRING REVIEW ROUTES HANDLER
const reviewRouteHandler = require("./routes/Review Routes");
application.use('/campgrounds/:campgroundId/reviews', reviewRouteHandler);

// OTHER ROUTES

// HOME ROUTE 
application.get('/', (request, response) => {
    response.render('HomePage', { title: "HomePage" });
});

// ANY OTHER ROUTE
application.all('*', (request, response, next) => {
    // ERROR HANDLED : Path not found.
    return next(new ApplicationError("I don't know that path!", 'Page Not Found', 404));
});


// STAGE 5: DEFINING ERROR HANDLING MIDDLEWARE FUNCTIONS //

// ERROR HANDLER MIDDLEWARE FUNCTION TO HANDLE DEFAULT ERRORS
function handleDefaultErrors(error, request, response, next) {
    if (!error.statusCode || error.statusCode === 500) {
        console.log(`Error : ${error.message || error.description}`);
        return next(new ApplicationError());
    }
    return next(error);
}

// ERROR HANDLER MIDDLEWARE FUNCTION TO HANDLE APPLICATION ERRORS
function handleApplicationErrors(error, request, response, next) {
    console.log(`Error Occurred, ${error.title}`);
    response.status(error.statusCode).render('ErrorPage', { title: error.title, error });
}

// USING ERROR HANDLING MIDDLEWARES
application.use(handleDefaultErrors);
application.use(handleApplicationErrors);