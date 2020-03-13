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
require("./configs/sequelize.config.js")(app)
require("./configs/passport.config.js")(app);

// Models
setTimeout(() => {
  require("./models/user.model.js").Create();
  require("./models/subject.model.js").Create();
  require("./models/text.model.js").Create();
  require("./models/relation.model.js").Create();
}, 2000);

// Middlewares
require('./sockets/relation.socket.js')(app, io);
require('./sockets/subject.socket.js')(app, io);
require('./sockets/user.socket.js')(app, io);
require('./sockets/app.socket.js')(app, io);

// Controllers
app.use('/user', require("./controllers/user.controller.js"));

app.get('/', (req, res) => res.send("INDEX"));

// Server
http.listen(port, () => {
    console.log(`Server listening on port : ${port}`);
});