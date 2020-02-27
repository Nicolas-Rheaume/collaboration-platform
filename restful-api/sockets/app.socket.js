const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const db = require('../middleware/sequelize.mw');
const User = require('../models/user.model.js');

module.exports = function(app, io){

    io.on('connection', socket => {

      console.log('user connected');

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });   
}