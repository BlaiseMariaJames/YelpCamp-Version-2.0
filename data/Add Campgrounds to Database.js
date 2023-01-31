// REQUIRING MONGOOSE, READLINE AND CLOUDINARY
const mongoose = require("mongoose");
const readline = require("readline-sync");
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

// REQUIRING DATA AND SCHEMA
const cities = require("./Cities.js");
const { descriptors, places } = require("./Places.js");
const campCategories = {
    typeOf: ["rv", "tent", "backcountry", "cabin"],
    location: ["beach", "desert", "forest", "mountain", "lakefront"],
    amenity: ["family", "economic", "luxury", "pet-friendly"],
    activity: ["adventure", "educational", "hunting", "festival"]
};
const UserSchema = require("../models/Joi Models/User Model.js");

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
async function seedData(username, name, email, bio) {

    // STEP 1: DELETING EXISTING DATA //

    console.log("Deleting files, this may take a few seconds or several minutes...");
    // Delete all images inside YelpCamp folder in cloudinary.
    console.log("\nDeleting existing cloudinary images...");
    try {
        await cloudinary.api.delete_resources_by_prefix('YelpCamp/');
        // Delete YelpCamp folder in cloudinary.
        await cloudinary.api.delete_folder("YelpCamp/");
        // Delete any existing camp.
    } catch (error) {
        console.log("Couldn't delete images as your folder 'YelpCamp' was accidently deleted from your cloudinary account (OR) doesn't exist yet!\n");
    }
    console.log("Deleting existing campgrounds...");
    await Campground.deleteMany({});
    // Delete any existing user.
    console.log("Deleting existing users...");
    await User.deleteMany({});
    // Delete any existing review.
    console.log("Deleting existing reviews...");
    await Review.deleteMany({});
    console.log("\nExisting data deleted successfully!");
    readline.question("\nPress any key to continue...");
    console.clear();
    console.log("\nProceeding...");

    // STEP 2: CREATING DATA //

    // Create a new user account.
    console.log(`\nCreating User...\n\nusername: ${username}\nname: ${name}\nemail: ${email}\nbio: ${bio ? bio : "[no bio provided]"}\npassword: 'Colt@8055'\n\nNOTE: Your DEFAULT PASSWORD is 'Colt@8055' you can CHANGE it anytime in the webpage...`);
    console.log("\nUser data inserted successfully!");
    readline.question("\nPress any key to continue...");
    console.clear();
    console.log("\nProceeding...");
    const newUser = User({
        username, name, email, bio,
        image: { url: 'https://res.cloudinary.com/dtwgxcqkr/image/upload/v1700848280/YelpCamp%20Related%20Media/cga1fohb5tqspkkchdzd.png', filename: 'YelpCamp Related Media/cga1fohb5tqspkkchdzd' },
        salt: 'f73fc9d84a4ebf76b45fe25f90bcc0dcbf518582794711be134acb52ce7a6708',
        hash: 'cb5aeb164aba8736b7b51463467a4a6cafcf02545e5fb0f203f7022719c66cbef449c309f63b2123b494cc377c76fb34e0baddccb002755ec03fd0825a0f9923a7b1e5a48d01be26fc88406aa97d9f0246d93e344c750d618d37e5bf3f93226ffa92bca7973a4cda50beaced977144485b31e252f7dd1f6226ed564661eff0f3be9416a42ff2be0798b5a79577a2f95d8a2f793e22533f345e26d677b90e2326adab5339b7e856e2d04852ef193aa8a936b33c80451d18724aa724d448f31f133892bd784d10e42e90ec3a6ee77558a810f5ef81bf519f42e705ac8768022de2eb2b2bb85ca468727dbb31a881a86f966541d6b677d674a102765e1cbe939837466af961856f9341e48129320862b45d2cb01e3adcd3d623cb29d451f64c44909475746fa670238fbe48a95ad41949069a43a37756e588429b4443a069973168af9f8240bc6eb194c539a2a30bffee0e0bff61a9a9219487194acb3e5a1682cf149d0288d511ec4df2731c092dc0f29df32ddde931ab10b41abea01d7dddce796bff0a826d8cc397201c63062eaf63fef1483e8fea5617b1137632ee1ce517d3e01e1c5be0d91268fb302d2df54a9466c9a53e8b50031b342cfbeb9e39af5f09bd52145fe9f0231fbc4941bc44ee174f87902bc3010532eb8759edbd11d32c4a814bfd186f77f79f23529eae183485a26223563b37124ba43ae2080315405404'
    });
    await newUser.save();

    // Creating Campgrounds.
    console.log("\nCreating Campgrounds...");
    const num = parseInt(readline.question("\nEnter the number of campgrounds you wish to seed (Each campground may take upto 8-10 seconds) : "));
    if (num && num > 0) {
        console.log(`\nSeeding ${num} Campgrounds, this may take several minutes...\n`);
        for (let i = 1; i <= num; i++) {
            // Assign same author.
            const oldAuthor = await User.findOne({ username });
            const author = oldAuthor._id.toString();
            // Select a random title.
            const title = `${findRandom(descriptors)} ${findRandom(places)}`.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            // Select images
            const images = await uploadSampleCampgroundImages();
            // Select a random price.
            let price = Math.floor(Math.random() * 10000) + 2001;
            price -= price % 500;
            // Select a random location.
            const { city, state, longitude, latitude } = findRandom(cities);
            const location = `${city}, ${state}`.replace(/[\r\n\t]+/gm, ' ').replace(/`/g, "'").replace(/"/g, "'");
            // Select geometry.
            let geometry = {
                type: "Point",
                coordinates: [longitude, latitude]
            }
            // Random description.
            const description = 'An awesome place awaits you...';
            // Random categories.
            const categories = {};
            for (const [key, value] of Object.entries(campCategories)) {
                categories[key] = findRandom(value);
            }
            // Campground suggested on.
            const addedOn = new Date();
            // Default average campground rating
            const avgRating = 0;
            // Creating new camp.
            console.log(`Seeding Campground ${i} into database...`);
            const camp = new Campground({ author, title, images, price, location, accurateLocation: location, geometry, description, categories, addedOn, avgRating });
            await camp.save();
        }
        console.log("\nData inserted successfully!");
    } else {
        console.log("\nNo data was inserted!");
    }
};

// REQUIRING DATABASE URL
const dbURL = process.env.ATLAS_DATABASE_URL || 'mongodb://localhost:27017/yelpcamp';

// CONNECTING TO MONGO DATABASE USING MONGOOSE
mongoose.set("strictQuery", false);
mongoose.connect(dbURL, {
    // PASSING REQUIRED OPTIONS TO AVOID DEPRECIATION WARNINGS IN FUTURE
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// VERIFING DATABASE CONNECTION
console.log("\nConnecting to the database...");
const databaseConnection = mongoose.connection;
// If failed.
databaseConnection.on("error", console.error.bind(console, "\nError!, Couldn't connect to the database.\nPossible Reason: Please check if you have mongodb and mongosh properly installed and mongod running...\n\nInstallation Guides:\n\nFor Windows Users: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/\nFor Mac Users: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/\nFor Linux Users: https://www.mongodb.com/docs/manual/administration/install-on-linux/\n\nOther Reasons:\n\n"));
// If successful.
databaseConnection.once("open", async () => {
    console.log("We are connected to the database and are good to go!\n");
    console.log("WARNING: THIS FILE IS USED TO SEED FAKE CAMPGROUND DATA INTO YOUR DATABASE!\nTHIS FILE WILL DELETE ALL YOUR EXISTING CAMPGROUND DATA BOTH FROM YOUR DATABASE AND CLOUDINARY ACCOUNT!");
    const permission = readline.question(`\nAre you really sure to continue? Type 'yes' to continue...\nNote: If you are running this file for the very first time, type 'yes'\n\nType Here: `);
    if (permission.toLowerCase() === "yes") {
        console.clear();
        console.log("\nProceeding...\n\nRequesting User details - The campgrounds created will be registered under the following user details...");
        let username = readline.question("\nUsername Instructions :\n\nUsername Example: john123 or john_123\n\n1. Should start with a lowercase letter from (a-z).\n2. Must be between 3 to 20 characters long.\n3. Must end with a letter (a-z) or number (0-9).\n4. Must not contain a sequence of two or more underscores (_).\n5. Can contain ONLY lowercase letters from (a-z), digits, or underscores.\n6. Please do not keep an explicit or inappropriate name/username. It may lead to suspension of your account.\n\nNote: Choose wisely your username, for you will not be able to change it later.\n\nEnter your username (cannot be changed later): ");
        let name = readline.question("\nEnter your full name: ");
        let email = readline.question("\nEnter your email (cannot be changed later): ");
        let bio = readline.question("\nEnter your bio (Optional): ");
        let validateUser = { username, name, email, bio, password: "Replace@123" };
        let { error } = UserSchema.validate(validateUser);
        // IF ANY SCHEMATIC ERROR
        while (error) {
            console.clear();
            let errorMessage = error.details.map(error => error.message).join(',');
            console.log(`\n\nUSER DATA VALIDATION ERROR: \n==========================\nCannot create user account, ${errorMessage}.`);
            console.log("\nTrying again....");
            username = readline.question("\nUsername Instructions :\n\nUsername Example: john123 or john_123\n\n1. Should start with a lowercase letter from (a-z).\n2. Must be between 3 to 20 characters long.\n3. Must end with a letter (a-z) or number (0-9).\n4. Must not contain a sequence of two or more underscores (_).\n5. Can contain ONLY lowercase letters from (a-z), digits, or underscores.\n6. Please do not keep an explicit or inappropriate name/username. It may lead to suspension of your account.\n\nNote: Choose wisely your username, for you will not be able to change it later.\n\nEnter your username (cannot be changed later): ");
            name = readline.question("\nEnter your full name: ");
            email = readline.question("\nEnter your email (cannot be changed later): ");
            bio = readline.question("\nEnter your bio (Optional): ");
            validateUser = { username, name, email, bio, password: "Replace@123" };
            error = UserSchema.validate(validateUser).error;
        }
        console.clear();
        console.log("\nProceeding...\n");
        await seedData(username, name, email, bio)
            .then(() => {
                console.log("\nDisconnecting from the database...");
                mongoose.connection.close();
                console.log("We are disconnected to the database. Please check out for the changes!");
            })
            .catch((error) => {
                console.log("\nError!, Couldn't seed data into the database!", error);
            });
    } else {
        console.log("\nAborting...");
        console.log("Disconnecting from the database...");
        mongoose.connection.close();
        console.log("We are disconnected to the database. No changes were made!");
    }
});