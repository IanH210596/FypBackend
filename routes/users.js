var express = require('express');
var router = express.Router();
const User = require('../models/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/createUser', (req, res, next) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    email: req.body.email,
    password: req.body.password,
  });
  user.save();
  res.status(201).json({
    message: "User Created Successfully"
  });
});

module.exports = router;
