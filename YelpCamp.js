// STAGE 1: SETTING THE SERVER, VIEW ENGINE, ASSETS, FORM/JSON DATA AND PATHS //

// REQUIRING EXPRESS, PATH, METHOD-OVERRIDE AND MONGOOSE
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

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



// STAGE 3: CONNECTING TO DATABASE AND RESPONDING TO THE SERVER //

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

// RESPONDING TO THE HOME ROUTE 
application.get('/', (request, response) => {
    response.render('HomePage');
});

// RESPONDING TO ANY OTHER ROUTE
application.get('*', (request, response) => {
    response.render('PageNotFound');
});