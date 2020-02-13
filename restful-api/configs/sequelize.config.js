const Sequelize = require('sequelize');

module.exports = function(app){

    const sequelize = new Sequelize('nodemysql', 'root', 'password', {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 3000,
            idle: 10000
        },
    });

    // Test DB
    sequelize.authenticate()
        .then(() => {
            console.log('Sequelize : Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Sequelize : Unable to connect to the database:', err);
        });
}
