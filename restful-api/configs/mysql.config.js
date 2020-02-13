const mysql = require('mysql');

module.exports = function(app){

    // Create Connection
    const db = mysql.createConnection({
        host        : 'localhost',
        user        : 'root',
        password    : 'password',
        database    : 'nodemysql'
    });

    // Connect
    db.connect((err) => {
        if(err){
            throw err;
        }
        console.log('MySql : Connection has been established succesfully');
    });

    // Create DB
    app.get('/createdb', (req, res) => {
        let sql = 'CREATE DATABASE nodemysql';
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Database created...');
        });
    });
}
