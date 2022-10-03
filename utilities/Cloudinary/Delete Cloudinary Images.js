// REQUIRING CLOUDINARY
const { cloudinary } = require("./Cloudinary Configuration");

// FUNCTION TO DELETE CAMPGROUND IMAGES FROM CLOUDINARY (IF IN CASE OF ANY ERROR WHILE UPLOADING)
const deleteCampgroundImages = (campgroundImages) => {
    // Deleting images.
    for (let file of campgroundImages) {
        cloudinary.uploader.destroy(file.filename);
    }
};

module.exports = deleteCampgroundImages;