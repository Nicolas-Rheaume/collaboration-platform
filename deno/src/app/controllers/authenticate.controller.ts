import express, { Application } from 'express';
import { Socket, Server } from 'socket.io'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { ConnectionService } from '../services/connection.service';

import { User, UserModel, UserRole } from '../models/user.model';
import { configuration } from '../configuration'

export class AuthenticateController {

    constructor(
        private app: Application,
        private io: Server,
        private cs: ConnectionService,
    ) {
        io.on('connection', socket => {

            // Login
            socket.on('authenticate/login', async ({username, password}) => {
                try {
                    const response = await this.login(socket, username, password).catch(err => { throw err; });
                    socket.emit("authenticate/validated", response); 
                } catch(err) { socket.emit("authenticate/login-error", err); }
            })

            // Register
            socket.on('authenticate/register', async ({username, email, password}) => {
                try {
                    console.log(username);
                    const newUser = await this.register(username, email, password).catch(err => { throw err; });
                    const response = await this.login(socket, username, password).catch(err => { throw err; });
                    socket.emit("authenticate/validated", response); 
                } catch(err) { socket.emit("authenticate/register-error", err); }
            })

            // Authenticate
            socket.on('authenticate/token', async (token: string) => {
                try {
                    const user = await this.tokenAuthentication(socket, token).catch(err => { throw err; });
                    socket.emit("authenticate/currentUser", user); 
                } catch(err) { socket.emit("authenticate/login-error", err); }
            })
        });
    }

    // Login
    private async login(socket: Socket, loginUsername: string, loginPassword: string): Promise<any> {
        return new Promise<any>( async(resolve, reject) => {
            try {
                const {user, password} = await UserModel.findOneWithPassword({where: {username: loginUsername}}).catch(err => { throw err; })
                bcrypt.compare(loginPassword, password, (err: any, isMatch: boolean) => {
                    if(err) reject("Passwords do not match");
                    else if(isMatch) {
                        const token = jwt.sign({ username: user.username }, configuration.JWT_SECRET, {
                            expiresIn: 604800 // 1 week
                        });

                        this.cs.setUser(socket, user);
                        resolve({
                            success: true,
                            token: 'JWT ' + token,
                            user: user.getClientVersion()
                          });
                    } else {
                        reject("Wrong password");
                    }
                });
            } catch(err) { reject(err); }
        })
    }

    // Register
    private async register(username: string, email: string, password: string): Promise<any> {
        return new Promise<any>( async(resolve, reject) => {
            try {
                await UserModel.UsernameAndEmailDontExist(username, email).catch(err => { throw err; });
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) throw err;
                    else {
                        bcrypt.hash(password, salt, async (err, hash) => {
                            if(err) throw err;
                            else {
                                const newUser = await UserModel.create(username, email, hash, UserRole.CONTRIBUTOR).catch(err => { throw err; });
                                resolve(newUser.getClientVersion())
                            }
                        });
                    }
                });
            } catch(err) { reject(err); }
        })
    }

    // token Authentication
    private async tokenAuthentication(socket: Socket, token: string): Promise<any> {
        return new Promise<any>( async(resolve, reject) => {
            try {
                if(token == '' || token == null) reject('Empty token');
                else{
                    jwt.verify(token.replace(/^JWT\s/, ''), configuration.JWT_SECRET, async (err, decoded) => {
                        if(err) reject("Invalid token")
                        else {
                            const newUser = await UserModel.findOneByUsername(decoded.username).catch(err => { throw err; });
                            this.cs.setUser(socket, newUser);
                            resolve(newUser.getClientVersion());
                        }
                    });
                }
            } catch(err) { reject(err); }
        })
    }
}