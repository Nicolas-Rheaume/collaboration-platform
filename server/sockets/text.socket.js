const User = require('../models/user.model.js');
const Subject = require('../models/subject.model.js');
const Text = require('../models/text.model.js');
const Relation = require('../models/relation.model.js');

const NAME = "Text: ";

module.exports = function(app, io){

  io.of("text").on('connection', socket => {

    // Client connected
    console.log(NAME + 'user connected');

    // Client disconnected
    socket.on('disconnect', () => {
      console.log(NAME + 'user disconnected');
    });

    // Create Text and link

    /*
    // Get All Users 
    socket.on('get', (data) => {
      Subject.findAll().then(subjects => {
        socket.emit("get", subjects);
      }).catch(err => console.log(err));
    });

    // Get User by id
    socket.on('get subject by id', (data) => {
      Subject.findByPk(data).then(subject => {
        socket.emit("get", subject);
      }).catch(err => console.log(err));
    });

    // Update Users
    socket.on('update', (data) => {
      Subject.findAll().then(subjects => {
        socket.emit("update", subjects);
        socket.broadcast.emit("update", subjects);
      }).catch(err => console.log(err));
    });

    // User created
    socket.on('create', (data) => {

      let newSubject = {
        title: '',
        description: '',
      }
    
      if(data.hasOwnProperty('title')) { newSubject.title = data.title; }
      else if(data.hasOwnProperty('description')) { newSubject.description = data.description; }
    
      Subject.create(newSubject).then((subject) => {
        Subject.findAll().then(subjects => {
          socket.emit("update", subjects);
          socket.broadcast.emit("update", subjects);
        }).catch(err => console.log(err));
      });
    });

    // Save user
    socket.on('save', (data) => {
      console.log(data);
      Subject.update(
        { description: data.description },
        { where: { id: data.id }}
      ).then(result => {
        Subject.findByPk(data.id).then(subject => {
          socket.emit("get", subject);
          socket.broadcast.emit("get", subject);
        }).catch(err => console.log(err));
      })
      .catch(err =>
        err => console.log(err)
      )
      /*
      Subject.findAll().then(subjects => {
        socket.emit("get", subjects);
      }).catch(err => console.log(err));
      *//*
    });
    */
    /*
    // User deleted
    socket.on('delete', (subject) => {

      Subject.destroy({
        where: {
          id: subject.id,
          title: subject.title
        }
      }).then(() => {
        Subject.findAll().then(subjects => {
          socket.emit("update", subjects);
          socket.broadcast.emit("update", subjects);
        }).catch(err => console.log(err));
      });
    });
    */
  });
}