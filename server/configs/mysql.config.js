
// Dependencies
const mysql = require('mysql');
const config = require('../configuration.js');

// Variables
const HOST      = process.env.HOST_IP_ADDRESS   || config.database_host;
const USER      = process.env.MYSQL_USER        || config.database_user;
const PASSWORD  = process.env.MYSQL_PASSWORD    || config.database_password;
const DATABASE  = process.env.MYSQL_DATABASE    || config.database_name
const PORT      = process.env.MYSQL_PORT        || 3306

module.exports = (app) => {
    return new Promise(resolve => {

        // Create Connection
        const db = mysql.createConnection({
            host        : HOST,
            user        : USER,
            password    : PASSWORD,
            port        : PORT
        });

        // Connect
        db.connect((err) => {
            if(err){ throw err; }
            console.log('MySql : Connection has been established succesfully');

            // Check if database exists
            var query =  "SHOW DATABASES";
            db.query(query, (err, results) => {
                if(err) throw err;

                // Check if database already exists
                let databaseExists = false;
                for(let i = 0; i < results.length; i++) {
                    if(results[i].Database === DATABASE){
                        databaseExists = true;
                        break;
                    }
                }

                // If database does not exist, create it
                if(!databaseExists) {
                    query = 'CREATE DATABASE ' +  DATABASE;
                    db.query(query, (err, results) => {
                        if(err) throw err;
                        console.log("MySQL : " + DATABASE + " has been created.");
                    });
                }

                // Connect to the new database
                var connection = mysql.createConnection({
                    host        : HOST,
                    user        : USER,
                    password    : PASSWORD,
                    port        : PORT
                });

                connection.connect((err) => {
                    if(err) throw err;
                    console.log('MySql : Succesfully connected to the database : ' + DATABASE);
                    resolve();
                });
            });
        });
    });
}
