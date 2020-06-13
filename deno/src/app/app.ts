import express, { Application } from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import { createServer, Server } from 'http';
import mysql from 'mysql';
import path from 'path';
import SocketIO from 'socket.io';
import { configuration } from './configuration'

import { dbConfig } from './configs/mysql.config';
import { ConnectionService } from './services/connection.service';

import appRoutes from './routes/app.routes';

import { AuthenticateController } from './controllers/authenticate.controller';
import { DashboardController } from './controllers/dashboard.controller';

import "reflect-metadata";
import { createConnection } from "typeorm";
import { UserModel } from './models/user.model';
import { PageModel } from './models/page.model';

export class App {

    // Variables
    private app: Application;
    private port: string | number;
    private server: Server;
    private io: SocketIO.Server;

    private cs: ConnectionService;

    constructor() {
        this.initialization();
        this.configuration();
        this.middleswares();
        this.routes();
        this.models();
        this.controllers();
    }

    private initialization(): void {
        this.app    = express();
        this.port   = process.env.SERVER_PORT || configuration.SERVER_PORT;
        this.server = createServer(this.app);
        this.io     = SocketIO(this.server);
        this.cs    = new ConnectionService(this.io);
    }

    private configuration(): void {
        this.app.use(cors());
        this.app.options('*', cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "/public")));
    }

    private middleswares(): void {
    }

    private routes(): void {
        this.app.use('/', appRoutes);
    }

    private async models(): Promise<void> {
        return new Promise( async(resolve, reject) => {
            await dbConfig;
            await UserModel.initialize();
            await PageModel.initialize();
            resolve();
        });
    }

    private controllers(): void {
        const authenticateController = new AuthenticateController(this.app, this.io, this.cs);     
        const dashboardController = new DashboardController(this.app, this.io, this.cs);       
    }

    public async listen(): Promise<void> {
        await this.server.listen(this.port, () => {
            console.log(`Server listening on port : ${this.port}`);
        });
    }
}