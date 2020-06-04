// Dependencies
const Sequelize = require('sequelize');
const config = require('../configuration.js');

// Variables
const HOST      = process.env.HOST_IP_ADDRESS   || config.database_host;
const USER      = process.env.MYSQL_USER        || config.database_user;
const PASSWORD  = process.env.MYSQL_PASSWORD    || config.database_password;
const DATABASE  = process.env.MYSQL_DATABASE    || config.database_name
const PORT      = process.env.MYSQL_PORT        || 3306

module.exports = new Sequelize(
    DATABASE, 
    USER, 
    PASSWORD, {
    host: HOST,
    port: PORT,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    },
    logging: false
});