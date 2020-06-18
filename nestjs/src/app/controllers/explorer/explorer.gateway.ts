import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ExplorerController } from './explorer.controller';
import { Text } from 'app/entities/text.entity';

@WebSocketGateway()
export class ExplorerGateway {
	// Variables
	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('Explorer Gateway');

	// Constructor
	constructor(private explorerController: ExplorerController) {}

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	@SubscribeMessage('explorer/initialize')
	public async initialize(client: Socket, url: string): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const texts: Text[] = await this.explorerController.initialize(client, url).catch(err => {
				throw err;
			});
			client.emit('explorer/texts', texts);
			return {
				event: 'explorer/error',
				data: {
					success: true,
					message: '',
				},
			};
		} catch (err) {
			return {
				event: 'explorer/error',
				data: {
					success: false,
					message: err,
				},
			};
		}
	}

	@SubscribeMessage('explorer/moveTextAtIndex')
	public async moveTextAtIndex(client: Socket, [from, to]: [number, number]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const document: Document = await this.explorerController.moveTextAtIndex(client, from, to).catch(err => {
				throw err;
			});
			return {
				event: 'editor/error',
				data: {
					success: true,
					message: '',
				},
			};
		} catch (err) {
			return {
				event: 'editor/error',
				data: {
					success: false,
					message: err,
				},
			};
		}
	}
}
