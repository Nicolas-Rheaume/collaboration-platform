const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const db = require('../middleware/sequelize.mw');
const User = require('../models/user.model.js');

const NAME = "Users : ";

module.exports = function(app, io){

  io.of("users").on('connection', socket => {

    // Client connected
    console.log(NAME + 'user connected');

    // Client disconnected
    socket.on('disconnect', () => {
      console.log(NAME + 'user disconnected');
    });

    // Register new User
    socket.on('register', (user) => {
      User.RegisterUser(user).then((data) => {
        if(data.success === false) socket.emit("register_message", data.message);
        else {
          let newUser = {
            username: data.user.dataValues.username,
            email: data.user.dataValues.email,
            password: user.password1
          }
          User.AuthenticateUser(newUser).then((data) => {
            if(data.success === false) socket.emit("register_message", data.message);
            else socket.emit("authenticate", data);
          });
        }
      });
    });

    // Login user
    socket.on('login', (user) => {
      User.AuthenticateUser(user).then((data) => {
        if(data.success === false) socket.emit("login_message", data.message);
        else socket.emit("authenticate", data);
      });
    });



    // Get All Users 
    socket.on('get', (data) => {
      User.findAll().then(users => {
        socket.emit("get", users);
      }).catch(err => console.log(err));
    });

    // Update Users
    socket.on('update', (data) => {
      User.findAll().then(users => {
        socket.emit("update", users);
        socket.broadcast.emit("update", users);
      }).catch(err => console.log(err));
    });

    // User deleted
    socket.on('delete', (user) => {

      User.destroy({
        where: {
          id: user.id,
          username: user.username
        }
      }).then(() => {
        User.findAll().then(users => {
          socket.emit("update", users);
          socket.broadcast.emit("update", users);
        }).catch(err => console.log(err));
      });
    });

    // User authenticate
    socket.on('authenticate', (user) => {

      const username = user.username;
      const password = user.password;

      console.log("asd");

      jwt.sign({user}, 'secretkey', {expiresIn: '30s'}, (err, token) => {
        socket.emit("update", token);
      });
      /*
      User.destroy({
        where: {
          id: user.id,
          username: user.username
        }
      }).then(() => {
        User.findAll().then(users => {
          socket.emit("update", users);
          socket.broadcast.emit("update", users);
        }).catch(err => console.log(err));
      });
      */
    });
    

  });
  


/*
    io.on('connection', socket => {

      console.log('user connected');

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });

      socket.on("get message", (data) => {
          console.log("server : " + data);
          socket.emit("message", {msg: data, user: socket.username});
          
        socket.emit("new message", {msg: data, user: socket.username});
        socket.broadcast.emit("new message", {msg: data, user: socket.username});
      });
      


    });


   */
   
  }