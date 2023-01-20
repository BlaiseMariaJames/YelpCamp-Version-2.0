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
    }
});

// CONFIGURING PASSPORT-LOCAL-MONGOOSE TO USER SCHEMA
UserSchema.plugin(passportLocalMongoose);

// CREATING USER MODEL
const User = mongoose.model('User', UserSchema);

// EXPORTING USER MODEL
module.exports = User;