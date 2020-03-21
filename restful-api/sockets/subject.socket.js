const Subject = require('../models/subject.model.js');
const NAME = "Subject : ";

module.exports = function(app, io){

  io.of("subject").on('connection', socket => {

    // Client connected
    console.log(NAME + 'user connected');

    // Client disconnected
    socket.on('disconnect', () => {
      console.log(NAME + 'user disconnected');
    });

    // Create Subject
    socket.on('create', (data) => {
      Subject.CreateSubject(data).then(() => {
        Subject.GetAllSubjects().then(subjects => {
          socket.emit("update", subjects);
          socket.broadcast.emit("update", subjects);
        });
      });
    });

    // Create New Subject
    socket.on('create-new-subject', (title) => {
      if(title === '' || title === null) socket.emit("new-subject-response", {success: false, message: "Invalid subject title"});
      Subject.GetSubjectByTitle(title).then((subject) => {
        if(subject != null) socket.emit("new-subject-response", {success: false, message: "Subject title already exists. Try another one?"});
        else {
          Subject.CreateSubjectByTitle(title).then(() => {
            Subject.GetAllSubjects().then(subjects => {
              socket.emit("new-subject-response", {success: true, message: "successfully created a new subject"});
              socket.emit("update", subjects);
              socket.broadcast.emit("update", subjects);
            });
          });
        }
      })
    });


    // Get All Subjects 
    socket.on('get-all', () => {
      Subject.GetAllSubjects().then(subjects => {
        socket.emit("subjects-response", subjects);
      });
    });

    // Get Subject by id
    socket.on('get subject by id', (data) => {
      Subject.GetSubjectByID(data).then(subject => {
        socket.emit("get", subject);
      });
    });

    // Update Subject
    socket.on('save', (data) => {
      Subject.UpdateSubject(data).then(subject => {
        socket.emit("get", subject);
        socket.broadcast.emit("get", subject);
      });
    });

    // Delete Subject
    socket.on('delete', (subject) => {
      Subject.DeleteSubjectByID(subject.id).then(() => {
        Subject.GetAllSubjects().then(subjects => {
          socket.emit("update", subjects);
          socket.broadcast.emit("update", subjects);
        });
      });
    });

    // Update User - fix
    socket.on('update', (data) => {
      Subject.Subject.findAll().then(subjects => {
        socket.emit("update", subjects);
        socket.broadcast.emit("update", subjects);
      }).catch(err => console.log(err));
    });


  });
}