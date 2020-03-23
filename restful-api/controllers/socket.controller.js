/*****************************************************************************
    *  VARIABLES
*****************************************************************************/
// Global
const User = require('../models/user.model');
const Subject = require('../models/subject.model');
const Text = require('../models/text.model');
const Relation = require('../models/relation.model');

// Local
let connections = new Array();
let hashmap = new Array();

module.exports = function(app, io){

  io.on('connect', socket => {
    console.log("connected");
  })

    io.on('connection', socket => {

      /*****************************************************************************
          *  MAIN
      *****************************************************************************/

      // User Connect
      connections.push(socket);
      socket.connectedOn = Date.now();
      console.log('Connected: %s sockets connected', connections.length);

      // User Disconnect
      socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
      });

      // User Route
      socket.on("path", ({url}) => {
        connections[connections.indexOf(socket)].path = url;
        console.log(connections.indexOf(socket) + ": " + socket.path);
      });

      // User Information


      // User Subject

      /*****************************************************************************
          *  ADMINISTRATION
      *****************************************************************************/
      // Get all connected users
      socket.on('user/connectedUsers', () => {
        if(socket.path === '/administration') {
          socket.emit('user/all-users', connections.map(user => { return {
            id: user.id,
            user: user.user,
            path: user.path,
            connectedOn: user.connectedOn
          }}));
        }
      });

      /*****************************************************************************
          *  REGISTRATION
      *****************************************************************************/

      // Login
      socket.on('user/login', async (user) => { 
        const data = await User.LoginUser(user).catch(err => { socket.emit("user/login-error", err); });
        connections[connections.indexOf(socket)].user = data.user;
        socket.emit("user/validated", data); 
      });

      // Register
      socket.on('user/register', async (user) => { 
        const data = await User.RegisterAndLoginUser(user).catch(err => { socket.emit("user/register-error", err); });
        connections[connections.indexOf(socket)].user = data.user;
        socket.emit("user/validated", data); 
      });

      // Authenticate
      socket.on('user/authenticate', async (token) => { 
        const user = await User.AuthenticateUser(token).catch(err => { socket.emit("user/login-error", err); });
        connections[connections.indexOf(socket)].user = user;
        socket.emit("user/currentUser", user); 
      });

      /*****************************************************************************
          *  DASHBOARD
      *****************************************************************************/

      // Create Subject By Title
      socket.on('subject/create-by-title', async (title) => {
        await Subject.CreateSubjectByTitle(title).then( async() => {
          const subjects = await Subject.GetAllSubjects().catch(err => { socket.emit("subject/dashboard-error", err); });
          socket.emit("subject/create-error", null);
          io.emit("subject/dashboard", subjects);
        }).catch(err => { socket.emit("subject/create-error", err); });
      });

      // Delete Subject By Title
      socket.on('subject/delete-by-title', async (title) => {
        await Subject.DeleteSubjectByTitle(title).catch(err => { socket.emit("subject/delete-error", err); });
        const subjects = await Subject.GetAllSubjects().catch(err => { socket.emit("subject/dashboard-error", err); });
        io.emit("subject/dashboard", subjects);
      });

      // Get All Subjects 
      socket.on('subject/get-all', async () => {
        const subjects = await Subject.GetAllSubjects().catch(err => { socket.emit("subject/dashboard-error", err); });
        socket.emit("subject/dashboard", subjects);
      });

      // Search Subjects
      socket.on('subject/search', async (search) => {
        await Subject.DeleteSubjectByTitle(title).catch(err => { socket.emit("subject/delete-error", err); });
        const subjects = await Subject.GetAllSubjects().catch(err => { socket.emit("subject/dashboard-error", err); });
        socket.emit("subject/dashboard", subjects);
        socket.broadcast.emit("subject/dashboard", subjects);
      });

      /*****************************************************************************
          *  EDITOR
      *****************************************************************************/

      // Get All Editor Texts
      socket.on('editor/all-texts', async () => {
        console.log("editor texts");
        /*
        await Subject.DeleteSubjectByTitle(title).catch(err => { socket.emit("subject/delete-error", err); });
        const subjects = await Subject.GetAllSubjects().catch(err => { socket.emit("subject/dashboard-error", err); });
        socket.emit("subject/dashboard", subjects);
        socket.broadcast.emit("subject/dashboard", subjects);
        */
      });
      /*


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





      /*
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



        socket.on("login", data => {
          console.log(data);
      });
      */


  



    });   
}

hashmap['test'] = () => {   User.Test();    }

//hashmap['test'] = User.Test();

/*************************************************************************************************************************************************
 * USER HASHMAP
*************************************************************************************************************************************************/
