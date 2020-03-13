const Sequelize = require('sequelize');
const config = require('../configuration.js');

module.exports = new Sequelize(config.database_name, config.database_user, config.database_password, {
    host: config.database_host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    },
});