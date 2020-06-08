import * as socketIo from 'socket.io';

import { Connection } from '../types/connection.type';

export class SocketManager {

    private connections: Connection[];
    private io: SocketIO.Server;

    constructor(io: SocketIO.Server) {
        this.io = io;

        // User connect
        this.io.on('connect', (socket: any) => {
            console.log("connected");
        })

        this.io.on('connection', socket => {

            // User Disconnect
            socket.on('disconnect', () => {
                console.log('disconnect');
            });

        });
    }


}

/*
import express, { Request, Response } from "express";

export const TestRouter = express.Router();

let count = 0;

TestRouter.get('/asd', async (req: Request, res: Response) => {
    try {
        count++;
        res.send(`<p>${count}</p>`);
    } catch (e) {
        res.send(e.message);
    }
  });


export class Test {

    // Variables
    private count: number = 0;


    // Main
    constructor() {

    }

    public increase(): number {
        this.count++;
        return this.count;
    }
}
*/
