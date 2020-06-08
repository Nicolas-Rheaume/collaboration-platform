import { User } from "../types/user.type";
import { Socket } from "socket.io";


export class ConnectionService {

    public user: User;
    public socket: Socket;

    constructor() {

    }
}