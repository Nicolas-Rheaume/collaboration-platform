import express from 'express';

import { ConnectionService } from '../services/connection.service';

export class RegisterController {

    count: number = 0;

    constructor(
        private app: express.Application,
        private io: SocketIO.Server,
        private cs: ConnectionService,
    ) {
        app.get('/register', (req, res) => {  
            res.sendFile(__dirname + '/index.html');
        });

        // User Connect
        io.on('connect', socket => {
            this.count++;
            console.log("connected: %s sockets connected", this.count);
        })

        io.on('connection', socket => {
            // User Disconnect
            socket.on('disconnect', () => {
                this.count--;
                console.log('Disconnected: %s sockets connected', this.count);
            });
        });
        //this.app.use('/register', (req, res) => {   this.register() })
    }

    private register() {
        console.log('register');
    }
}