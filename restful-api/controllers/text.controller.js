const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../middleware/sequelize.mw');
const User = require('../models/text.model.js');


// Get All Users
router.get('/findAll', (req, res) => {
  console.log("test");
  User.findAll()
    .then(users => {
      console.log(users);
      res.sendStatus(200);
    })
    .catch(err => console.log(err));
});

module.exports = router;