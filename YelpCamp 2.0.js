// STAGE 1: SETTING THE APPLICATION //

// ACCESS .ENV VARIABLES IF NOT IN "PRODUCTION MODE" BY REQUIRING DOTENV
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// REQUIRING NODE MODULES
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");
const mongoSanitize = require("express-mongo-sanitize");
const passportLocalStrategy = require("passport-local");

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

// DEFINING HTTP VERBS
application.use(methodOverride('_method'));

// SERVING STATIC ASSETS IN EXPRESS AND SETTING THE 'PUBLIC' PATH
application.use(express.static('public'));
application.set('public', path.join(__dirname, '/public'));

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("./utilities/Error Handling/Application Error Handler Class");



// STAGE 2: CONFIGURATION OF MIDDLEWARES //

// REQUIRING DATABASE URL
const dbURL = process.env.ATLAS_DATABASE_URL || 'mongodb://localhost:27017/yelpcamp';

// REQUIRING SESSION CREDENTIALS
const { SESSION_NAME = "newSession", SESSION_SECRET = "ColtIsGreat!", SESSION_SECURE = false } = process.env;

// CONFIGURING SESSION STORE
const mongoDBStore = MongoStore.create({
    mongoUrl: dbURL,
    // Update after 24 hours if no changes.
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: SESSION_SECRET
    }
});

// If failed.
mongoDBStore.on("error", function (error) {
    console.log("Session Store Error!", error);
});

// CONFIGURING SESSIONS
const sessionConfig = {
    name: SESSION_NAME,
    store: mongoDBStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Only through https.
        secure: (SESSION_SECURE === 'true'),
        // Only through http.
        httpOnly: true,
        // Expire within a week.
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        // Expire within a week.
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
application.use(session(sessionConfig));

// CONFIGURING MORGAN
function print(request, response, next) {
    console.log();
    next();
}
application.use(print, morgan('tiny'));

// CONFIGURING FLASH
application.use(flash());

// CONFIGURING HELMET
const helmet = require("./utilities/Security/Helmet Configuration");
application.use(helmet);

// CONFIGURING EXPRESS MONGOOSE SANITIZE
application.use(mongoSanitize());

// CONFIGURING PASSPORT
application.use(passport.initialize());
application.use(passport.session());

// REQUIRING USER MODEL
const User = require("./models/Mongoose Models/User Model");

// CONFIGURING PASSPORT TO USE LOCAL STRATEGY ON USER MODEL
passport.use(new passportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DEFINING MIDDLEWARE TO ACCESS THE USER LOGGED IN, FLASH MESSAGES SUCCESS AND ERRORS (IF ANY) AT EVERY ROUTE
application.use((request, response, next) => {
    response.locals.currentUser = request.user;
    response.locals.error = request.flash('error');
    response.locals.success = request.flash('success');
    next();
});



// STAGE 3: CONNECTING TO DATABASE //

// CONNECTING TO MONGO DATABASE USING MONGOOSE
mongoose.set("strictQuery", false);
mongoose.connect(dbURL, {
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
    // LISTENING TO THE SERVER
    application.listen(portNumber, () => {
        console.log("\nStarting the server...");
        console.log(`Serving at http://localhost:${portNumber}`);
    });
});



// STAGE 4: RESPONDING TO THE SERVER //

// CAMPGROUND MODEL BASED ROUTES

// REQUIRING CAMPGROUND ROUTES HANDLER
const campgroundRouteHandler = require("./routes/Campground Routes");
application.use('/campgrounds', campgroundRouteHandler);

// USER MODEL BASED ROUTES

// REQUIRING USER ROUTES HANDLER
const userRouteHandler = require("./routes/User Routes");
application.use('/', userRouteHandler);

// REVIEW MODEL BASED ROUTES

// REQUIRING REVIEW ROUTES HANDLER
const reviewRouteHandler = require("./routes/Review Routes");
application.use('/campgrounds/:campgroundId/reviews', reviewRouteHandler);

// OTHER ROUTES

// HOME ROUTE 
application.get('/', (request, response) => {
    response.render('HomePage', { title: "HomePage", current: "", category: "" });
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
    response.status(error.statusCode).render('ErrorPage', { title: error.title, error, current: "", category: "" });
}

// USING ERROR HANDLING MIDDLEWARES
application.use(handleDefaultErrors);
application.use(handleApplicationErrors);