/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { User } from 'app/models/user/user.entity';

// Controllers
import { AuthenticateController } from 'app/controllers/authenticate/authenticate.controller';

/*****************************************************************************
 *  AUTHENTICATE GATEWAY
 *****************************************************************************/
@WebSocketGateway()
export class AuthenticateGateway implements OnGatewayInit {
	// Variables
	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('Authenticate Gateway');

	// Constructor
	constructor(private controller: AuthenticateController) {}

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	/*****************************************************************************
	 *  AUTHENTICATE EVENTS
	 *****************************************************************************/

	// Login
	@SubscribeMessage('authenticate/login')
	public async login(client: Socket, { username, password }): Promise<WsResponse<string>> {
		try {
			const response = await this.controller.login(client, username, password).catch(err => {
				throw err;
			});
			return { event: 'authenticate/validated', data: response };
		} catch (err) {
			return { event: 'authenticate/login-error', data: err };
		}
	}

	// Register
	@SubscribeMessage('authenticate/register')
	public async register(client: Socket, { username, email, password }): Promise<WsResponse<string>> {
		try {
			const userEntity = await this.controller.register(username, email, password).catch(err => {
				throw err;
			});
			const response = await this.controller.login(client, username, password).catch(err => {
				throw err;
			});
			return { event: 'authenticate/validated', data: response };
		} catch (err) {
			return { event: 'authenticate/register-error', data: err };
		}
	}

	// Register
	@SubscribeMessage('authenticate/token')
	public async token(client: Socket, token: string): Promise<WsResponse<User>> {
		try {
			const user = await this.controller.tokenAuthentication(client, token).catch(err => {
				throw err;
			});
			return { event: 'authenticate/currentUser', data: user };
		} catch (err) {
			return { event: 'authenticate/login-error', data: err };
		}
	}
}
