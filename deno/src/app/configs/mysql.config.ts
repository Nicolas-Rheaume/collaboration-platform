import "reflect-metadata";
import {createConnection} from "typeorm";

import { UserEntity } from '../models/user.model';
import { PageEntity } from '../models/page.model';

/*

const dbConfig = async() => {
    createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "password",
        database: "collab-db-dev-1.0",
        entities: [
            UserEntity
        ],
        synchronize: true,
        logging: false
    }).then(connection => {
        console.log("MySQL : Connected to the database");
    }).catch(error => console.log(error));
    
}
*/

const dbConfig = createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "collab-db-dev-1.0",
    entities: [
        UserEntity,
        PageEntity
    ],
    synchronize: true,
    logging: false
}).then(connection => {
    console.log("MySQL : Connected to the database");
}).catch(error => console.log(error));

export { dbConfig }

/*
import express from 'express';
import {createConnection, createConnections, Connection} from "typeorm";
import "reflect-metadata";

const connection = createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test"
});


/*
createConnection().then(async (connection) => {
    const app = express();
    app.get('/create', async (req, res) => {
      const todo = new Todo();
      todo.name = 'A Todo';
      await connection.manager.save(todo);
      res.send(todo);
    });
    app.get('/read', async (req, res) => {
      const todos = await connection.manager.find(Todo);
      res.send(todos);
    });
    app.listen(3000, () => console.log('Example app listening on port 3000!'));
  }).catch((error) => console.log(error));


/*
import { Sequelize } from 'sequelize';

const HOST: string      = process.env.HOST_IP_ADDRESS       || '192.168.0.183';
const USER: string      = process.env.MYSQL_USER            || 'root';
const PASSWORD: string  = process.env.MYSQL_PASSWORD        || 'password';
const DATABASE: string  = process.env.MYSQL_DATABASE        || 'collab-db-dev-1.0'
const PORT: number      = Number(process.env.MYSQL_PORT)    || 3306

const db = new Sequelize(
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




export { db }
*/

/*
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
*/