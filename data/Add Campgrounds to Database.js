// REQUIRING MONGOOSE, USER, REVIEW AND CAMPGROUND MODEL
const mongoose = require("mongoose");
const User = require("../models/Mongoose Models/User Model.js");
const Review = require("../models/Mongoose Models/Review Model.js");
const Campground = require("../models/Mongoose Models/Campground Model.js");

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
    // Delete any existing user.
    await User.deleteMany({});
    // Delete any existing review.
    await Review.deleteMany({});
    // Create a new user account.
    const newUser = User({
        username: 'BlaiseMariaJamesPalackeel',
        email: 'blaisemariajamespalackeel@gmail.com',
        salt: '94512648c8fecd71a96444521b6cbdbaa89830504ba876f7598878523e35f321',
        hash: '50df686ad987d8bdfea3cdd965f8c15eecb9dd52251b29405666e93fa8f48ea7b0da8d6198eb872dadd3646bb1b86fa1e63c6206f0862a56c8036139b9f2c89d921fd983460682bfe4124cc29c4517e0d1f154fe7556cbc15342e7bed40c24135b1e15523b404f3a88c8f79a1d7c64823909d487369b75298653ef48f4ca39631fb2ea30155398f6296ba7833a3753e8939a58eabacbb3b0f57dfe9a9f6102e08736c07335f87d22080ae2a3f350fe09027d4bab3387c39350e9e83669143e9de7496bd2a8268add24a695817bc4d6d58d5474e02d50f37ce55d6aaa38740f478d55acdbeb2b923e8fc976b1ebdffd42a7c9b0ffb78b0d7be4a4491f93b4acb78f9fabd9cf9291dc8d89b2a44a7ffe855aee414e0433e5d8563d3d5ad77b7ac9d5e5ff66eaa59cf033a1a8972ad056c9c5b365879456f1fcbeaa9fd71deff7558703e4df55b06d9888d7ac6997f2fcb3b9c37b07368a6c25b0ddfc8d4196e45f246eb9ac95713f9e9f0e0468e94fceefb6332b8dd7180aef63f317663a4b4040b5f0f1ab0433101ce6f05dfb119a90c5481d513967ab35fe149e14687ec3c9c4d835e4ba5b053834db353bec1ce1d178649cf3395e1900ac3c004559b8fbc74d22a1bdfe4092c4de59d39611719dcd81d12e3e966c4180de5ed88b63d90d3244bac91b83ea5c87cfba5693c0c04490f42919b747fb7184d43264655f5c2c294c'
    });
    await newUser.save();
    for (let i = 0; i < 50; i++) {
        // Assign same author.
        const oldAuthor = await User.findOne({ username: 'BlaiseMariaJamesPalackeel' });
        const author = oldAuthor._id.toString();
        // Select a random title.
        const title = `${findRandom(descriptors)} ${findRandom(places)}`;
        // Select images
        const images = [
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662496/YelpCamp%20Related%20Media/kuujmyxmhgqidqxdiryw.avif',
                filename: 'YelpCamp Related Media/kuujmyxmhgqidqxdiryw'
            },
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662496/YelpCamp%20Related%20Media/kdp1b460l3i3umhktc1z.avif',
                filename: 'YelpCamp Related Media/kdp1b460l3i3umhktc1z'
            },
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662495/YelpCamp%20Related%20Media/fldbpy2bf0ijnoyrdkfl.avif',
                filename: 'YelpCamp Related Media/fldbpy2bf0ijnoyrdkfl'
            },
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662496/YelpCamp%20Related%20Media/fyacoqbovnlxsyxivpr7.avif',
                filename: 'YelpCamp Related Media/fyacoqbovnlxsyxivpr7'
            },
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662496/YelpCamp%20Related%20Media/emcdhae4bqbs2wkiiuvg.avif',
                filename: 'YelpCamp Related Media/emcdhae4bqbs2wkiiuvg'
            },
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662496/YelpCamp%20Related%20Media/lte6vytweasjqgwvyoxj.avif',
                filename: 'YelpCamp Related Media/lte6vytweasjqgwvyoxj'
            },
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662495/YelpCamp%20Related%20Media/uv7ukkqtwaomlzykphhx.avif',
                filename: 'YelpCamp Related Media/uv7ukkqtwaomlzykphhx'
            },
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662496/YelpCamp%20Related%20Media/txrqbyy0d027ebxstwpc.avif',
                filename: 'YelpCamp Related Media/txrqbyy0d027ebxstwpc'
            },
            {
                url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1675662496/YelpCamp%20Related%20Media/sc9d7ilh1pks18ncjupn.avif',
                filename: 'YelpCamp Related Media/sc9d7ilh1pks18ncjupn'
            }
        ];
        // Select a random price.
        let price = Math.floor(Math.random() * 10000) + 2001;
        price -= price % 500;
        // Select a random location.
        const location = `${findRandom(cities).city}, ${findRandom(cities).state}`;
        // Random description.
        const description = 'An awesome place awaits you...';
        // Creating new camp.
        const camp = new Campground({ author, title, images, price, location, description });
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