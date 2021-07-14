const mongoose = require("mongoose");

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
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
}); 

module.exports = mongoose.model("VaccinationDetails", vaccinationDetailsSchema);