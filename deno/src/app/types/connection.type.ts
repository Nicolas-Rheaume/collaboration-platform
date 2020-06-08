import { User } from './user.type';
import { Socket } from 'socket.io';


export interface Connection {
    user: User
    socket: Socket
}