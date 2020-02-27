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
require("./configs/mysql.config.js")(app);
require("./configs/sequelize.config.js")(app);
//require("./configs/passport.config.js")(app);

// Middlewares
require('./sockets/subject.socket.js')(app, io);
require('./sockets/user.socket.js')(app, io);
require('./sockets/app.socket.js')(app, io);

// Controllers
app.use('/user', require("./controllers/user.controller.js"));
//app.use('/', require("./controllers/api/project.controller.js"));

// Views
//app.use('/', require("./views/angular.view.js"));

/*
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'timeline',
  password : 'password',
  database : 'timeline'
});

connection.connect();



const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(events(connection));
*/

app.get('/', (req, res) => res.send("INDEX"));

// Server
http.listen(port, () => {
    console.log(`Server listening on port : ${port}`);
});