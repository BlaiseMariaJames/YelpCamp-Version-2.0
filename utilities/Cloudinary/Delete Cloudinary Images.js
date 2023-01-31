// REQUIRING CLOUDINARY
const { cloudinary } = require("./Cloudinary Configuration");

// FUNCTION TO DELETE IMAGES FROM CLOUDINARY (IF IN CASE OF ANY ERROR WHILE UPLOADING)
const deleteImages = (imageFiles) => {
    // Deleting images.
    for (let file of imageFiles) {
        cloudinary.uploader.destroy(file.filename);
    }
};

module.exports = deleteImages;