const app           = require('express')();
const bodyParser    = require('body-parser');
const cors          = require('cors');
const express       = require('express');
const http          = require('http').Server(app);
const mysql         = require('mysql');
const path          = require('path');
const io            = require('socket.io')(http);

// Port
const port = process.env.PORT || 3000;

// Static paths
//app.use(express.static(path.join(__dirname, "../client/dist")));

// Configurations
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./configs/mysql.config.js")(app).then(() => {
  require("./configs/sequelize.config.js")(app).then(() => {
    require("./configs/passport.config.js")(app);
  
    // Models
    require("./models/user.model.js").CreateTableIfNonExistant();
    require("./models/page.model.js").CreateTableIfNonExistant();
    require("./models/text.model.js").CreateTableIfNonExistant();
    require("./models/document.model.js").CreateTableIfNonExistant();
  
  })
});

// Controller
require('./controllers/socket.controller.js')(app, io);

// Sockets
/*
require('./sockets/content.socket.js')(app, io);
require('./sockets/relation.socket.js')(app, io);
require('./sockets/subject.socket.js')(app, io);
require('./sockets/user.socket.js')(app, io);
require('./controllers/socket.controller.js')(app, io);*/

// Controllers
//app.use('/user', require("./controllers/user.controller.js"));

app.get('/', (req, res) => res.send("INDEX"));

// Server
http.listen(port, () => {
    console.log(`Server listening on port : ${port}`);
});