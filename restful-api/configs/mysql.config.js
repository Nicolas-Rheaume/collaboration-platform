const mysql = require('mysql');
const config = require('../configuration.js');

module.exports = function(app){

    // Create Connection
    const db = mysql.createConnection({
        host        : config.database_host,
        user        : config.database_user,
        password    : config.database_password/*,
        database    : config.database_name*/
    });

    // Connect
    db.connect((err) => {
        if(err){ throw err; }
        console.log('MySql : Connection has been established succesfully');

        // Check if database exists
        var query =  "SHOW DATABASES";
        db.query(query, (err, results) => {
            if(err) throw err;

            let databaseExists = false;
            for(let i = 0; i < results.length; i++) {
                if(results[i].Database === config.database_name){
                    databaseExists = true;
                    break;
                }
            }

            // If database does not exist, create it
            if(!databaseExists) {
                query = 'CREATE DATABASE ' +  config.database_name;
                db.query(query, (err, results) => {
                    if(err) throw err;
                    console.log("MySQL : " + config.database_name + " has been created.");
                });
            }

            // Connect to the new database
            var connection = mysql.createConnection({
                host        : config.database_host,
                user        : config.database_user,
                password    : config.database_password,
                database    : config.database_name
            });

            connection.connect((err) => {
                if(err) throw err;
                console.log('MySql : Succesfully connected to the database : ' + config.database_name);
            });
        });
    });

    // Create DB
    app.get('/createdb', (req, res) => {
        let sql = 'CREATE DATABASE collaboration-database';
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Database created...');
        });
    });
}
