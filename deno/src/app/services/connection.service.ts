import { Socket, Server } from "socket.io";

import { User } from '../models/user.model';

export class Connection {
    user: User
    socket: Socket

    constructor(socket: Socket) {
        this.user = new User();
        this.socket = socket;
    }

    public toJSON() {
        
    }
}


export class ConnectionService {

    public connections: Connection[] = [];

    constructor(
        private io: Server
    ) { 
        this.io.on('connect', (socket: Socket) => { this.create( socket ); });

        this.io.on('connection', (socket: Socket) => { 

            socket.on('disconnect', () => { this.destroy( socket ); });

        });
    }

    private create(socket: Socket): void {
        this.connections.push(new Connection(socket));
        console.log("WS : connect - %s sockets connected", this.connections.length);
    }

    private destroy(socket: Socket): void {
        this.connections.splice(this.getIndex(socket), 1);
        console.log('WS : disconnect - %s sockets connected', this.connections.length);
    }

    public getIndex(socket: Socket): number {
        let index: number = 0;
        for(let i = 0; i < this.connections.length; i++) {
            if(this.connections[i].socket === socket) {
                index = i;
                break;
            }
        }
        return index;
    }

    public getConnection(socket: Socket): Connection {
        let connection: Connection;
        for(let i = 0; i < this.connections.length; i++) {
            if(this.connections[i].socket === socket) {
                connection = this.connections[i];
                break;
            }
        }
        return connection;
    }

    public getUser(socket: Socket): User {
        return this.getConnection(socket).user;
    }

    public setUser(socket: Socket, user: User): void {
        this.connections[this.getIndex(socket)].user = user;
    }


}