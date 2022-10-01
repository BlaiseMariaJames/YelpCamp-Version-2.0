// REQUIRING CLOUDINARY AND CLOUDINARY STORAGE
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// CONFIGURING CLOUDINARY WITH .ENV VARIABLES
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// CREATING CLOUDINARY STORAGE INSTANCE FOR YELPCAMP
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowed_formats: ['avif', 'gif', 'jpg', 'jpeg', 'png', 'webp']
    }
});

// EXPORTING CLOUDINARY AND CLOUDINARY STORAGE INSTANCE
module.exports = { cloudinary, storage };