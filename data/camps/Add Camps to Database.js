// REQUIRING MONGOOSE AND CAMPGROUND MODEL
const mongoose = require("mongoose");
const Campground = require("../../models/Campground Model.js");

// REQUIRING DATA
const cities = require("./Cities.js");
const { descriptors, places } = require("./Places.js");

// DEFINING FIND RANDOM FUNCTION
const findRandom = array => array[Math.floor(Math.random() * array.length)];

// DEFINING WAIT FUNCTION
async function wait(ms) {
    return new Promise(res => setTimeout(res, ms))
}

// DEFINING FUNCTION TO CREATE COMMAND LINE PROGRESS BAR
async function createProgressBar(i) {
    if (i != 0) {
        console.log("\nConnecting to the database...");
        console.log("We are connected to the database and are good to go!\n");
    }
    console.log("Seeding data into database...");
    console.log(`Inserting (${i + 1}/50) camp data...`);
    await wait(100);
    if (i != 49) {
        console.clear();
    }
}

// DEFINING SEED DATA FUNCTION
async function seedData() {
    // Delete any existing camp.
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        // Select a random title.
        const title = `${findRandom(descriptors)} ${findRandom(places)}`;
        // Select a random price.
        let price = Math.floor(Math.random() * 10000) + 2001;
        price -= price % 500;
        // Select a random location.
        const location = `${findRandom(cities).city}, ${findRandom(cities).state}`;
        // Creating new camp
        const camp = new Campground({
            title: title,
            price: price,
            location: location
        });
        await camp.save()
            .then(async () => {
                // CREATE PROGRESS BAR
                await createProgressBar(i);
            })
            .catch((error) => {
                console.log("Couldn't enter data into database.", error);
            });
    }
};

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
    console.log("We are connected to the database and are good to go!\n");
    await seedData()
        .then(() => {
            console.log("\nData inserted Successfully...");
            console.log("Closing database...");
            mongoose.connection.close();

        })
        .catch(() => {
            console.log("\nError!, Couldn't seed data into the database.");
        });
});