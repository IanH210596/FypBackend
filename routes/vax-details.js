var express = require('express');
var router = express.Router();
const vaccinationDetails = require('../models/vaccinationDetails.js')

router.post('/addVaccinationDetails', (req, res, next) => {
    const details = new vaccinationDetails({
        ppsn: req.body.ppsn,
        dateOfBirth: req.body.dateOfBirth,
        selectedGender: req.body.selectedGender,
        nationality: req.body.nationality,
        addressOne: req.body.addressOne,
        addressTwo: req.body.addressTwo,
        city: req.body.city,
        postCode: req.body.postCode,
        selectedVaccinePreference: req.body.selectedVaccinePreference,
    });
    details.save();
    res.status(201).json({
      message: "Vaccination Details Added Successfully"
    });
  });


module.exports = router;