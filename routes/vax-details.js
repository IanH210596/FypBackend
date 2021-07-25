var express = require('express');
var router = express.Router();
const vaccinationDetails = require('../models/vaccinationDetails.js');
const checkAuth = require('../middleware/check-auth');

router.post('/addVaccinationDetails', checkAuth, (req, res, next) => {
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
        user: req.userData.userId
    });
    details.save().then(vaccinationDetails => {
      res.status(201).json({
        message: "Vaccination Details Added Successfully",
        userVaccinationDetails: vaccinationDetails
      });  
    }).catch(() => {
      res.status(500).json({
        message: "Added Vaccination Details Could Not Be Saved!"
      });
    });
  });

  router.get('/getVaccinationDetails', checkAuth, (req, res, next) => {
    vaccinationDetails.findOne({user: req.userData.userId}).then(vaccinationDetails => {
      if(!vaccinationDetails){
          return res.status(404).json({
          message: "Vaccination Details Not Yet Added!",
          userVaccinationDetails: vaccinationDetails
        })
      } else {
          return res.status(200).json({
          message: "Vaccination Details Retrieved Successfully",
          userVaccinationDetails: vaccinationDetails
        });
      }
    }).catch(() => {
        return res.status(404).json({
        message: "Vaccination Details Not Found!",
        userVaccinationDetails: undefined
      })
    })
  });

  router.put('/updateVaccinationDetails', checkAuth, (req, res, next) => {
    const details = new vaccinationDetails({
      _id: req.body._id,
      ppsn: req.body.ppsn,
      dateOfBirth: req.body.dateOfBirth,
      selectedGender: req.body.selectedGender,
      nationality: req.body.nationality,
      addressOne: req.body.addressOne,
      addressTwo: req.body.addressTwo,
      city: req.body.city,
      postCode: req.body.postCode,
      selectedVaccinePreference: req.body.selectedVaccinePreference,
      user: req.userData.userId
  });
  vaccinationDetails.updateOne({_id: req.body._id, user: req.userData.userId}, details).then(result => {
    if(result.nModified > 0) {
      res.status(200).json({
        message: "Vaccination Details Updated Successfully",
      });
    } else {
      res.status(401).json({
        message: "No Change to Vaccination Details!",
      });
    }
  }).catch(() => {
    res.status(500).json({
      message: "Updated Vaccination Details Could Not Be Saved!"
    });
  })
  });

module.exports = router;