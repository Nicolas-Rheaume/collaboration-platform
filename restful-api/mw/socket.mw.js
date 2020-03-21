const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const db = require('../middleware/sequelize.mw');
const User = require('../models/user.model.js');

let users = new Array();
let connections = new Array();
let hashmap = new Array();

module.exports = function(app, io){

    io.on('connection', socket => {

        // Debugging
        console.log(Object.values(io.sockets.clients().connected));

        // Connect
        connections.push(socket);
        console.log('Connected: %s sockets connected', connections.length);

        // Disconnect
        socket.on('disconnect', () => {
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length);
        });

        // New User
        socket.on('new user', (username, callback) => {
            callback(true);
            socket.username = username;
            users.push(username);
            updateUsernames();
        });


        updateUsernames = () => {
            io.sockets.emit('get users', usernames);
        }


        // ROOMS
        socket.on("join_room", room => {
            socket.join(room);
        });


        socket.on("message", ({ room, message }) => {
            socket.to(room).emit("message", {
              message,
              name: "Friend"
            });
          });




    });   
}


hashmap['test'] = User.Test();

/*************************************************************************************************************************************************
 * USER HASHMAP
*************************************************************************************************************************************************/
