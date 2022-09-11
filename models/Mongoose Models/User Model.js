// REQUIRING MONGOOSE 
const mongoose = require("mongoose");

// REQUIRING PASSPORT-LOCAL-MONGOOSE
const passportLocalMongoose = require("passport-local-mongoose");

// STORING SCHEMA OBJECT INTO A VARIABLE
const Schema = mongoose.Schema;

// DEFINING USER SCHEMA
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// CONFIGURING PASSPORT-LOCAL-MONGOOSE TO USER SCHEMA
UserSchema.plugin(passportLocalMongoose);

// CREATING USER MODEL
const User = mongoose.model('User', UserSchema);

// EXPORTING USER MODEL
module.exports = User;