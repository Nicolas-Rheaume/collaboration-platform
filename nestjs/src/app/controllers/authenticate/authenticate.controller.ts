/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { Controller, Logger, Get, Render } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { environment } from 'environments/environment';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Services
import { ConnectionService } from 'app/models/connection/connection.service';
import { UserModel } from 'app/models/user/user.model';
import { User, UserRole, UserEntity } from 'app/models/user/user.entity';

/*****************************************************************************
 *  AUTHENTICATE CONTROLLER
 *****************************************************************************/
@Controller('authenticate')
export class AuthenticateController {
	// Variables
	private logger: Logger = new Logger('Authenticate Controller');

	// Contructor
	constructor(private readonly cs: ConnectionService, private readonly userModel: UserModel) {
		this.logger.log('Initialized!');
	}

	// Login
	public async login(socket: Socket, loginUsername: string, loginPassword: string): Promise<any> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const userEntity = await this.userModel.findOneByUsername(loginUsername).catch(err => {
					throw err;
				});
				if(userEntity == undefined) throw "User does not exists";
				else {
					bcrypt.compare(loginPassword, userEntity.password, async (err: any, isMatch: boolean) => {
						if (err) reject('Passwords do not match');
						else if (isMatch) {
							const token = jwt.sign({ username: userEntity.username }, environment.jwt_secret, {
								expiresIn: 604800, // 1 week
							});

							this.cs.setUserEntity(socket, userEntity);
							resolve({
								success: true,
								token: 'JWT ' + token,
								user: await userEntity.getUser(),
							});
						} else {
							reject('Wrong password');
						}
					});
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	// Register
	public async register(username: string, email: string, password: string): Promise<UserEntity> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				await this.userModel.CheckUsernameAndEmailDontExist(username, email).catch(err => {
					throw err;
				});
				bcrypt.genSalt(environment.bcrypt_saltRounds, (err, salt) => {
					if (err) throw err;
					else {
						bcrypt.hash(password, salt, async (err, hash) => {
							if (err) throw err;
							else {
								const userEntity = await this.userModel.create(username, email, hash, UserRole.CONTRIBUTOR).catch(err => {
									throw err;
								});
								resolve(userEntity);
							}
						});
					}
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	// token Authentication
	public async tokenAuthentication(socket: Socket, token: string): Promise<User> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				if (token == '' || token == null) reject('Empty token');
				else {
					jwt.verify(token.replace(/^JWT\s/, ''), environment.jwt_secret, async (err, decoded) => {
						if (err) reject('Invalid token');
						else {
							const userEntity = await this.userModel.findOneByUsername(decoded.username).catch(err => {
								throw err;
							});
							this.cs.setUserEntity(socket, userEntity);
							resolve(userEntity.getUser());
						}
					});
				}
			} catch (err) {
				reject(err);
			}
		});
	}
}
