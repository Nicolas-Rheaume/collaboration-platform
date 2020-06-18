import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer, Server } from 'http';
import mysql from 'mysql';
import path from 'path';
import SocketIO from 'socket.io';

import { AppRouter } from './routes/app.router';

import { ConnectionService } from './services/connection.service';

import { RegisterController } from './controllers/register.controller';

export class Application {

  // Variables
  private app: express.Application;
  private port: string | number;
  private server: Server;
  private io: SocketIO.Server;

  private cs: ConnectionService;

  private registerController: RegisterController;

  // Main
  constructor() {

    // Constants
    this.app    = express();
    this.port   = process.env.SERVER_PORT || 3000;
    this.server = createServer(this.app);
    this.io     = SocketIO(this.server);

    // Configurations
    this.app.use(cors());
    this.app.options('*', cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Initialization
    this.cs = new ConnectionService();

    // Static paths
    this.app.use(express.static(path.join(__dirname, "../client/dist")));

    // Controllers
    new RegisterController(this.app, this.io, this.cs);

    // Routers
    AppRouter.default(this.app);
    //this.socketService = new SocketService(this.io);

    // Server
    this.listen();
  }

  private listen (): void {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port : ${this.port}`);
    });
  }

  public get application (): express.Application {
    return this.app;
  }
}

/*
// Configurations
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initializations

// Routes
app.get('/', (req, res) => {  res.send('The sedulous hyena ate the antelope!'); });

app.use(SocketRouter);

import test2 from './test2'


// Server
http.listen(port, () => {
  console.log(`Server listening on port : ${port}`);
});

/*
app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
*/