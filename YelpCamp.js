// STAGE 1: SETTING THE SERVER, VIEW ENGINE, ASSETS, FORM/JSON DATA AND PATHS //

// REQUIRING PATH, MORGAN, EXPRESS, EJS-MATE AND METHOD-OVERRIDE
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const ejsMate = require("ejs-mate");
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



// STAGE 2: DEFINING ERROR HANDLER, FUNCTIONS, LOGGER, AND HTTP VERBS //

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("./utilities/Application Error Handler Class.js");

// REQUIRING WRAPPER FUNCTION TO HANDLE ASYNC ERRORS
const handleAsyncErrors = require("./utilities/Async Error Handling Middleware Function.js");

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

// USING LOGGER, 'PATCH' AND 'DELETE' HTTP VERBS
application.use(print, morgan('tiny'));
application.use(methodOverride('_method'));



// STAGE 3: REQUIRING MONGOOSE, SCHEMA AND CONNECTING TO DATABASE //

// REQUIRING MONGOOSE, OBJECTID, CAMPGROUND AND REVIEW SCHEMA
const mongoose = require("mongoose");
const ObjectID = mongoose.Types.ObjectId;
const Campground = require("./models/Mongoose Models/Campground Model.js");
const Review = require("./models/Mongoose Models/Review Model.js");
const CampgroundSchema = require("./models/Joi Models/Campground Model.js");
const ReviewSchema = require("./models/Joi Models/Review Model.js");

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

// CRUD (CREATE - READ - UPDATE - DELETE) OPERATIONS ROUTES //

// CREATE OPERATION ROUTES

// New --> Form to create a new campground.
application.get('/campgrounds/new', (request, response) => {
    let error = "";
    response.render('campgrounds/New', { title: "New", error });
});

// Create --> Creates new campground on server.
application.post('/campgrounds', handleAsyncErrors(async (request, response, next) => {
    let { campground } = request.body;
    const { error } = CampgroundSchema.validate(campground);
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        errorMessage = `Cannot create campground, ${errorMessage}.`;
        response.status(400).render('campgrounds/New', { title: "Create", error: errorMessage });
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        const newCampground = new Campground(campground);
        await newCampground.save()
        response.redirect(`/campgrounds/${newCampground._id}`);
    }
}));

// READ OPERATION ROUTES

// Show --> Details for one specific campground.
application.get('/campgrounds/:id', handleAsyncErrors(async (request, response, next) => {
    const { id } = request.params;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    response.render('campgrounds/Show', { title: campground.title, campground });
}));

// Index --> Display all campgrounds.
application.get('/campgrounds', handleAsyncErrors(async (request, response, next) => {
    let error = "";
    let campgrounds = await Campground.find({});
    if (campgrounds.length > 0) {
        response.render('campgrounds/Index', { title: "Index", campgrounds, error });
    } else {
        error = "No campgrounds are currently available.";
        response.render('campgrounds/Index', { title: "Index", campgrounds, error });
    }
}));

// UPDATE OPERATION ROUTES

// Edit --> Form to edit a campground.
application.get('/campgrounds/:id/edit', handleAsyncErrors(async (request, response, next) => {
    let error = "";
    const { id } = request.params;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    response.render('campgrounds/Edit', { title: "Edit", campground, error });
}));

// Update --> Updates a campground on server.
application.patch('/campgrounds', handleAsyncErrors(async (request, response, next) => {
    let { id, campground } = request.body;
    const { error } = CampgroundSchema.validate(campground);
    if (error) {
        let errorMessage = error.details.map(error => error.message).join(',');
        // Below two lines of code will redirect to the same page and make user aware of errors.
        campground._id = id;
        errorMessage = `Cannot edit campground, ${errorMessage}.`;
        response.status(400).render('campgrounds/Edit', { title: "Edit", campground, error: errorMessage });
        // Use below code to redirect to Error Page and make user aware of errors.
        // return next(new ApplicationError(errorMessage, "Bad Request", 400));
    } else {
        const newCampground = await Campground.findById(id);
        Object.assign(newCampground, campground);
        await newCampground.save();
        response.redirect(`/campgrounds/${newCampground._id}`);
    }
}));

// DELETE OPERATIONS ROUTES

// Remove --> Form to remove a campground.
application.get('/campgrounds/:id/remove', handleAsyncErrors(async (request, response, next) => {
    const { id } = request.params;
    // ERROR HANDLED : Campground not found due to invalid Campground ID. 
    if (!ObjectID.isValid(id)) {
        return next(new ApplicationError("Sorry!, Invalid Campground ID. We couldn't find the campground!", 'Invalid Campground ID', 400));
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        // ERROR HANDLED : Campground not found.
        return next(new ApplicationError("Sorry!, We couldn't find the campground!", 'Campground Not Found', 404));
    }
    response.render('campgrounds/Remove', { title: "Remove", campground });
}));

// Delete --> Deletes a campground on server.
application.delete('/campgrounds', handleAsyncErrors(async (request, response, next) => {
    const { id } = request.body;
    await Campground.findByIdAndDelete(id)
        .then(() => {
            response.redirect('/campgrounds');
        })
        .catch((error) => {
            console("Couldn't delete the campground ", error);
        });
}));

// OTHER ROUTES //

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