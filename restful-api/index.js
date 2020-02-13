const app           = require('express')();
const bodyParser    = require('body-parser');
const cors          = require('cors');
const express       = require('express');
const http          = require('http').Server(app);
const mysql         = require('mysql');
const path          = require('path');

// Port
const port = process.env.PORT || 3000;

// Static paths
//app.use(express.static(path.join(__dirname, "../client/dist")));

// Configurations
app.use(cors());
require("./configs/mysql.config.js")(app);
require("./configs/sequelize.config.js")(app);
//require("./configs/body-parser.config.js")(app);
//require("./configs/passport.config.js")(app);

// Middlewares
//require('./mw/socket.declaration.js')(app, io);

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