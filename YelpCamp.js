// STAGE 1: SETTING THE SERVER, VIEW ENGINE, ASSETS, FORM/JSON DATA AND PATHS //

// REQUIRING EXPRESS, PATH, AND METHOD-OVERRIDE
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

// REQUIRING MONGOOSE AND CAMPGROUND SCHEMA
const mongoose = require("mongoose");
const Campground = require("./models/Campground Model.js");

// STARTING THE SERVER
let portNumber = 8888;
const application = express();

// SETTING THE VIEW ENGINE AND PATH
application.set('view engine', 'ejs');
application.set('views', path.join(__dirname, '/views'));

// PARSING FORM DATA AND JSON DATA
application.use(express.urlencoded({ extended: true }));
application.use(express.json());

// SERVING STATIC ASSETS IN EXPRESS AND SETTING THE 'PUBLIC' PATH
application.use(express.static('public'));
application.set('public', path.join(__dirname, '/public'));



// STAGE 2: DEFINING HTTP VERBS AND FUNCTIONS //

// USING 'PATCH' AND 'DELETE' HTTP VERBS
application.use(methodOverride('_method'));

// FUNCTION TO START LISTENING TO THE SERVER
async function startServer() {
    // LISTENING TO THE SERVER
    application.listen(portNumber, () => {
        console.log("\nStarting the server...");
        console.log(`Listening at the port ${portNumber}!`);
    });
}



// STAGE 3: CONNECTING TO DATABASE //

// CONNECTING TO MONGO DATABASE USING MONGOOSE
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/campgrounds", {
    // PASSING REQUIRED OPTIONS TO AVOID DEPRECIATION WARNINGS IN FUTURE
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// VERIFING DATABASE CONNECTION
const databaseConnection = mongoose.connection;
// If failed.
databaseConnection.on("error", console.error.bind(console, "\nError!, Couldn't connect to the database."));
// If successful.
databaseConnection.once("open", async () => {
    console.log("\nConnecting to the database...");
    console.log("We are connected to the database and are good to go!");
    await startServer();
});



// STAGE 4: RESPONDING TO THE SERVER //

// CRUD (CREATE - READ - UPDATE - DELETE) OPERATIONS ROUTES //

// CREATE OPERATION ROUTES

// New --> Form to create a new campground.
application.get('/campgrounds/new', (request, response) => {
    let error = "";
    response.render('campgrounds/New', { error });
});

// Create --> Creates new campground on server.
application.post('/campgrounds', async (request, response) => {
    let { campgroundFromForm } = request.body;
    const campground = new Campground(campgroundFromForm);
    await campground.save()
        .then(() => {
            response.redirect(`/campgrounds/${campground._id}`);
        })
        .catch(() => {
            let error = "Couldn't create a campground, Price of the campground on parsing has to be a number with a minimum value of 0.";
            response.render('campgrounds/New', { error });
        });
});

// READ OPERATION ROUTES

// Show --> Details for one specific campground.
application.get('/campgrounds/:id', async (request, response) => {
    const { id } = request.params;
    await Campground.findById(id)
        .then((campground) => {
            response.render('campgrounds/Show', { campground });
        })
        .catch((error) => {
            response.render('PageNotFound');
        });
});

// Index --> Display all campgrounds.
application.get('/campgrounds', async (request, response) => {
    let error = "";
    let campgrounds = await Campground.find({});
    if (campgrounds.length > 0) {
        response.render('campgrounds/Index', { campgrounds, error });
    } else {
        error = "No campgrounds are currently available.";
        response.render('campgrounds/Index', { campgrounds, error });
    }
});

// UPDATE OPERATION ROUTES

// Edit --> Form to edit a campground.
application.get('/campgrounds/:id/edit', async (request, response) => {
    let error = "";
    const { id } = request.params;
    await Campground.findById(id)
        .then((campground) => {
            response.render('campgrounds/Edit', { campground, error });
        }
        )
        .catch((error) => {
            response.render('PageNotFound');
        });
});

// Update --> Updates a campground on server.
application.patch('/campgrounds', async (request, response) => {
    let { id, title, price, location, description } = request.body;
    let campground = await Campground.findById(id);
    if (campground) {
        campground.title = title;
        campground.price = price;
        campground.location = location;
        campground.description = description;
        await campground.save()
            .then(() => {
                response.redirect(`/campgrounds/${campground.id}`);
            })
            .catch(() => {
                let error = "Couldn't edit the campground, Price of the campground on parsing has to be a number with a minimum value of 0.";
                response.render('campgrounds/Edit', { campground, error });
            });
    } else {
        response.render('PageNotFound');
    }
});

// DELETE OPERATIONS ROUTES

// Remove --> Form to remove a campground.
application.get('/campgrounds/:id/remove', async (request, response) => {
    const { id } = request.params;
    await Campground.findById(id)
        .then((campground) => {
            response.render('campgrounds/Remove', { campground });
        })
        .catch((error) => {
            response.render('PageNotFound');
        });
});

// Delete --> Deletes a campground on server.
application.delete('/campgrounds', async (request, response) => {
    const { id } = request.body;
    await Campground.findByIdAndDelete(id)
        .then(() => {
            response.redirect('/campgrounds');
        })
        .catch((error) => {
            console("Couldn't delete the campground ", error);
        });
});

// OTHER ROUTES //

// HOME ROUTE 
application.get('/', (request, response) => {
    response.render('HomePage');
});

// ANY OTHER ROUTE
application.get('*', (request, response) => {
    response.render('PageNotFound');
});