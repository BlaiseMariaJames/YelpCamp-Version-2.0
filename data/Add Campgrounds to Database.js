// REQUIRING MONGOOSE AND CLOUDINARY
const mongoose = require("mongoose");
const { cloudinary } = require("../utilities/Cloudinary/Cloudinary Configuration.js");

// ACCESS .ENV VARIABLES IF NOT IN "PRODUCTION MODE" BY REQUIRING DOTENV
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// CONFIGURING CLOUDINARY WITH .ENV VARIABLES
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// CONFIGURING MAPBOX GEOCODING
const mapboxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mapboxGeoCoding({ accessToken: mapboxToken });

// REQUIRING USER, REVIEW AND CAMPGROUND MODEL
const User = require("../models/Mongoose Models/User Model.js");
const Review = require("../models/Mongoose Models/Review Model.js");
const Campground = require("../models/Mongoose Models/Campground Model.js");

// REQUIRING DATA
const cities = require("./Cities.js");
const { descriptors, places } = require("./Places.js");

// DEFINING FIND RANDOM FUNCTION
const findRandom = array => array[Math.floor(Math.random() * array.length)];

// DEFINING FUNCTION TO UPLOAD IMAGES STORED LOCALLY TO CLOUDINARY
const uploadSampleCampgroundImages = async () => {
    let images = [];
    for (let i = 1; i <= 3; i++) {
        await cloudinary.uploader.upload(`public/SAMPLE CAMPGROUND IMAGES/SAMPLE_CAMPGROUND_IMAGE_${i}.avif`, {
            folder: "/YelpCamp",
            resource_type: "image"
        }).then((result) => {
            images.push(result);
        }).catch((error) => {
            console.log("error", JSON.stringify(error, null, 2));
        });
    }
    images = images.map(image => ({ url: image.url, filename: image.public_id }));
    return images;
}

// DEFINING SEED DATA FUNCTION
async function seedData() {

    // STEP 1: DELETING EXISTING DATA //

    console.log("Deleting files, this may take a few seconds or several minutes...");
    // Delete all images inside YelpCamp folder in cloudinary.
    console.log("\nDeleting existing cloudinary images...");
    await cloudinary.api.delete_resources_by_prefix('YelpCamp/');
    // Delete YelpCamp folder in cloudinary.
    await cloudinary.api.delete_folder("YelpCamp/");
    // Delete any existing camp.
    console.log("Deleting existing campgrounds...");
    await Campground.deleteMany({});
    // Delete any existing user.
    console.log("Deleting existing users...");
    await User.deleteMany({});
    // Delete any existing review.
    console.log("Deleting existing reviews...");
    await Review.deleteMany({});
    console.log("Existing data deleted successfully!");

    // STEP 2: CREATING DATA //

    console.log("\nSeeding 3 Campgrounds, this may take several minutes...");
    // Create a new user account.
    console.log("\nCreating User with username 'Unknown' and password 'coltisgreat'...");
    const newUser = User({
        username: 'Unknown',
        email: 'Unknown@gmail.com',
        salt: 'b70e6a9f24b279d2097371b8d39657af041cdb48c5ff61ba5ba5775cdba33843',
        hash: '3067162b122490dfa8aaa3cb41a42e31c1e6be3f5853dc834570ba6fe8f4451b0dec026af486f3098b10517a0a96b14bce0063fb0799d1da5ae2364c0156096aae9df0ceecd76cf401cb7614dfe86e245860518ae7958f433a11e9ff5365fc89ef1f96bb144da388d69211ee42576710f285b4142f6a120cd2d93c1ef3c8e5476428533307226a90f3967c776d00404a443a3c96770c446fb4ec0833dbd68bb6cbd22a94044c85bf7e18781b895b831914116d160366f26fbc47d3e7c089b186768c543e6396951ae40b6e25f605432b40bbd771473f8277d05d3c70961af25f8d0e90e16d8cf70fda799ae1ce04f0fa329979a8b6e27ebef37cfdf109156f2336cb91b931a2d9ffb2101d8bed7e3ac0f42cacabf2dcfcced050295785be28e0eb3929a32e64a5d3fb2b25cfbbdb656a9da6caf6d5ad981ad2c135959f1fe2a3de0ed3899bb84417243b6424060ce853853d41e1250189566457ef1a79ebcbfa586db7ca2b77a10e586e5fdca84a39a712a763bc3922234b3a150a2c7563e4b91d78977ef73250d0c5b81e537a30a2ad275c8bd9b63aefcdd894e6ab80be7b487080ed22266e3962215f1e7563319bb381ab92143a334b2487399ff1f9788132f78c120b64dd7f9274c25170aa2349d8ebfb46f9a99fb5396ed3bb8868ad6557111b5649387d6fcdba40315e253ec1bd42bc1c8f5e0ed1bb389a15e92e03a921'
    });
    await newUser.save();
    for (let i = 1; i <= 3; i++) {
        // Assign same author.
        const oldAuthor = await User.findOne({ username: 'Unknown' });
        const author = oldAuthor._id.toString();
        // Select a random title.
        const title = `${findRandom(descriptors)} ${findRandom(places)}`;
        // Select images
        const images = await uploadSampleCampgroundImages();
        // Select a random price.
        let price = Math.floor(Math.random() * 10000) + 2001;
        price -= price % 500;
        // Select a random location.
        const location = `${findRandom(cities).city}, ${findRandom(cities).state}`;
        /* Select geometry.
        // APPROACH ONE: Geocoding location.
        const geoData = await geoCoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();
        let geometry = geoData.body.features[0].geometry;
        */
        // APPROACH TWO: Using Cities.js file.
        let geometry = {
            type: "Point",
            coordinates: [findRandom(cities).longitude, findRandom(cities).latitude]
        }
        // Random description.
        const description = 'An awesome place awaits you...';
        // Creating new camp.
        console.log(`Seeding Campground ${i} into database...`);
        const camp = new Campground({ author, title, images, price, location, accurateLocation: location, geometry, description });
        await camp.save();
    }
    console.log("Data inserted successfully!");
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
            console.log("\nDisconnecting from the database...");
            mongoose.connection.close();
            console.log("We are disconnected to the database. Please check out for the changes!");
        })
        .catch((error) => {
            console.log("\nError!, Couldn't seed data into the database.", error);
        });
});