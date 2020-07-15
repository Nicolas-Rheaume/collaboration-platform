/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

// Services
import { ConnectionService } from 'app/models/connection/connection.service';

/*****************************************************************************
 *  APP GATEWAY
 *****************************************************************************/
@WebSocketGateway()
export class AppGateway {
	// Variables
	private logger: Logger = new Logger('App Gateway');

	// Constructor
	constructor(private readonly cs: ConnectionService) {}

	// Initializer
	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	// On Connect
	handleConnection(client: Socket) {
		this.cs.create(client);
	}

	// On Disconnect
	handleDisconnect(client: Socket) {
		this.cs.destroy(client);
	}

	// On Path
	@SubscribeMessage('path')
	public async login(client: Socket, path: string): Promise<WsResponse<void>> {
		try {
			this.cs.getConnection(client).path = path;
			this.logger.verbose(this.cs.getConnection(client).userEntity.username + ' - ' + this.cs.getConnection(client).path);
			return;
		} catch (err) {
			return;
		}
	}
}
