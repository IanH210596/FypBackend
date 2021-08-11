var express = require('express');
var router = express.Router();
const vaccinationDetails = require('../models/vaccinationDetails.js');
const checkAuth = require('../middleware/check-auth');

// /addVaccinationDetails endpoint used for making requests to add vaccination details for logged in users. Endpoint uses checkAuth handler to check that a valid web token is provided to access this endpoint.
router.post('/addVaccinationDetails', checkAuth, (req, res, next) => {
    const details = new vaccinationDetails({
        // added vaccination details gotten from request body
        ppsn: req.body.ppsn,
        dateOfBirth: req.body.dateOfBirth,
        selectedGender: req.body.selectedGender,
        nationality: req.body.nationality,
        addressOne: req.body.addressOne,
        addressTwo: req.body.addressTwo,
        city: req.body.city,
        postCode: req.body.postCode,
        selectedVaccinePreference: req.body.selectedVaccinePreference,
        // user Id extracted from web token when request passes through the check-auth handler/middleware and userData.userId is appended to the request
        user: req.userData.userId
    });
    details.save().then(vaccinationDetails => {
      // Vaccination details are saved successfully and a success response and message is returned
      res.status(201).json({
        message: "Vaccination Details Added Successfully",
        userVaccinationDetails: vaccinationDetails
      });  
    }).catch(() => {
      //catch statement used to catch any errors and return an error status and message in response
      res.status(500).json({
        message: "Added Vaccination Details Could Not Be Saved!"
      });
    });
  });

  // /getVaccinationDetails endpoint used for making requests to get a user's already added vaccination details following login. Endpoint uses checkAuth handler to check that a valid web token is provided to access this endpoint.
  router.get('/getVaccinationDetails', checkAuth, (req, res, next) => {
    // user's vaccination details searched for in MongoDB Vaccination Details collection based on userId 
    vaccinationDetails.findOne({user: req.userData.userId}).then(vaccinationDetails => {
      if(!vaccinationDetails){
          // if no vaccination details are found, then an error status and message is returned in response
          return res.status(404).json({
          message: "Vaccination Details Not Yet Added!",
          userVaccinationDetails: vaccinationDetails
        })
      } else {
          // if vaccination details are found for the user, then a success status, message and their vaccination details are provided in response
          return res.status(200).json({
          message: "Vaccination Details Retrieved Successfully",
          userVaccinationDetails: vaccinationDetails
        });
      }
    }).catch(() => {
        //catch statement used to catch any errors and return an error status and message in response
        return res.status(404).json({
        message: "Vaccination Details Not Found!",
        userVaccinationDetails: undefined
      })
    })
  });

  // /updateVaccinationDetails endpoint used for making requests to update a user's already added vaccination details. Endpoint uses checkAuth handler to check that a valid web token is provided to access this endpoint.
  router.put('/updateVaccinationDetails', checkAuth, (req, res, next) => {
    const details = new vaccinationDetails({
      // updated vaccination details, along with the unique original vaccination details Id, gotten from request body
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
      // user Id extracted from web token when request passes through the check-auth handler/middleware and userData.userId is appended to the request
      user: req.userData.userId
  });
  // user's vaccination details to be updated searched for in MongoDB Vaccination Details collection based on vaccination details Id and userId 
  vaccinationDetails.updateOne({_id: req.body._id, user: req.userData.userId}, details).then(result => {
    if(result.nModified > 0) {          
      // if vaccination details are found and updated for the user, then a success status and message are provided in response
      res.status(200).json({
        message: "Vaccination Details Updated Successfully",
      });
    } else {
      // if no update is made to the found vaccination details, then an error status and message is returned in response
      res.status(401).json({
        message: "No Change to Vaccination Details!",
      });
    }
  }).catch(() => {
    //catch statement used to catch any errors and return an error status and message in response
    res.status(500).json({
      message: "Updated Vaccination Details Could Not Be Saved!"
    });
  })
  });

module.exports = router;