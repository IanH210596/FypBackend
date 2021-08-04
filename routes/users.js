var express = require('express');
var router = express.Router();
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const user = require('../models/user.js');


router.post('/createUser', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobile: req.body.mobile,
      email: req.body.email,
      password: hash,
    });
    user.save()
      .then(result => {
        res.status(201).json({
          message: "User Created Successfully",
          result: result
        });
      })
      .catch(() => {
        res.status(500).json({
          message: "Invalid User Details Provided!"
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      console.log(user);
      if(!user) {
        return res.status(401).json({
          message: "Invalid User Credentials!"
        })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password)
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: "Invalid User Credentials!"
      })
    }
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id}, 
      'very_long_super_strong_afaskgakjhkjakjghalkjhgkajslkjaskjg_secret_string', 
      {expiresIn: "1h"}
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Authentication Failed!"
    })
  })
});

module.exports = router;
