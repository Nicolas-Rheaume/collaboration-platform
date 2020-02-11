const mysql = require('mysql');

module.exports = function(app){

    // Create Connection
    const db = mysql.createConnections({
        host : 'localhost',
        user : 'me',
        password : 'secret',
        database : 'my_db'
    });

    // Connect
    db.connect((err) => {
        if(err){
            throw err;
        }
        console.log('MySql Connected...');
    });

    // Create DB
    app.get('/creatdb', (req, res) => {
        let sql = 'CREATE DATABASE nodemysql';
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Databse created...');
        });
    });
}
