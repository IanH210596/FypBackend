const mongoose = require("mongoose");

//schema with attributes for storing user's vaccination details in MongoDB. All attibutes are required.
const vaccinationDetailsSchema = mongoose.Schema({
    ppsn: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    selectedGender: {type: String, required: true},
    nationality: {type: String, required: true},
    addressOne: {type: String, required: true},
    addressTwo: {type: String, required: true},
    city: {type: String, required: true},
    postCode: {type: String, required: true},
    selectedVaccinePreference: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true} //this attribute has type of object id from the User model to ensure vaccination details can be linked to a unique user Id
}); 

module.exports = mongoose.model("VaccinationDetails", vaccinationDetailsSchema);