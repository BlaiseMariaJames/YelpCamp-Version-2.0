// REQUIRING MONGOOSE 
const mongoose = require("mongoose");

// REQUIRING PASSPORT-LOCAL-MONGOOSE
const passportLocalMongoose = require("passport-local-mongoose");

// STORING SCHEMA OBJECT INTO A VARIABLE
const Schema = mongoose.Schema;

// DEFINING IMAGE SCHEMA
const ImageSchema = new Schema({
    _id: { _id: false },
    url: {
        type: String,
        required: [true, "The field 'image url' is mandatory"]
    },
    filename: {
        type: String,
        required: [true, "The field 'image filename' is mandatory"]
    }
});

// DEFINING VIRTUAL FUNCTION TO SET VIRTUAL PROPERTY 'PROFILE' FOR AN IMAGE
ImageSchema.virtual('profile').get(function () {
    return this.url.replace('/upload', '/upload/w_80,h_80,c_fill,g_face,r_max,bo_3px_solid_black');
});

// DEFINING VIRTUAL FUNCTION TO SET VIRTUAL PROPERTY 'SMALL' FOR AN IMAGE
ImageSchema.virtual('navItem').get(function () {
    return this.url.replace('/upload', '/upload/w_35,h_35,c_fill,g_face,r_max,bo_3px_solid_black');
});

// DEFINING USER SCHEMA
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 20,
        match: /^[a-z](?!.*__)[a-z0-9_]{1,18}[a-z0-9]$/,
        required: [true, "The field 'username' is mandatory"]
    },
    name: {
        type: String,
        required: [true, "The field 'name' is mandatory"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "The field 'email' is mandatory"]
    },
    bio: {
        type: String,
        required: false
    },
    image: ImageSchema,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// CONFIGURING PASSPORT-LOCAL-MONGOOSE TO USER SCHEMA
UserSchema.plugin(passportLocalMongoose);

// CREATING USER MODEL
const User = mongoose.model('User', UserSchema);

// EXPORTING USER MODEL
module.exports = User;