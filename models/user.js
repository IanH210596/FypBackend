const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//schema with attributes for storing user details in MongoDB. All attibutes are required.
const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    mobile: {type: String, required: true},
    email: {type: String, required: true, unique: true}, //uniqueValidator used to ensure only unique emails can be registered for the app
    password: {type: String, required: true},
}); 

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);