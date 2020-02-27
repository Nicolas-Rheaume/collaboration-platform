const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const db = require('../middleware/sequelize.mw');
const User = require('../models/user.model.js');

module.exports = function(app, io){

  io.of("users").on('connection', socket => {

    // Client connected
    console.log('user connected to users');

    // Client disconnected
    socket.on('disconnect', () => {
      console.log('user disconnected from users');
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

    // User created
    socket.on('create', (data) => {


      let newUser = {
        username: '',
        email: '',
        password: '',
        role: 0,
      }
    
      if(data.hasOwnProperty('username')) { newUser.username = data.username; }
      else if(data.hasOwnProperty('email')) { newUser.username = data.email; }
      else if(data.hasOwnProperty('password')) { newUser.username = data.password; }
      else if(data.hasOwnProperty('role')) { newUser.username = data.role; }
    
      User.create(newUser).then((user) => {
        console.log(user);
        User.findAll().then(users => {
          socket.emit("update", users);
          socket.broadcast.emit("update", users);
        }).catch(err => console.log(err));
      });
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