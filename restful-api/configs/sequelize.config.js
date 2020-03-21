const Sequelize = require('sequelize');
const config = require('../configuration.js');

module.exports = (app) => {
    return new Promise(resolve => {

        // Sequelize Configuration
        const sequelize = new Sequelize(config.database_name, config.database_user, config.database_password, {
            host: config.database_host,
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                acquire: 3000,
                idle: 10000
            },
            logging: false
        });
    
        // Sequelize Authentication
        sequelize.authenticate()
            .then(() => {
                console.log('Sequelize : Connection has been established successfully.');
                resolve();
            })
            .catch(err => {
                console.error('Sequelize : Unable to connect to the database:', err);
                resolve();
            });
    });
}
