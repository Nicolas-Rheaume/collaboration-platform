import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ExplorerController } from './explorer.controller';
import { Text } from 'app/models/text/text.entity';
import { Concept } from 'app/models/concept/concept.entity';
import { Document } from 'app/models/document/document.entity';

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
	public async initialize(client: Socket, url: string): Promise<WsResponse<Concept>> {
		try {
			const explorerConcept: Concept = await this.explorerController.initialize(client, url).catch(err => {
				throw err;
			});
			return { event: 'explorer/concept', data: explorerConcept };
		} catch (err) {
			return { event: 'explorer/error', data: err };
		}
	}

	@SubscribeMessage('explorer/getDocument')
	public async getDocument(client: Socket, [corpusIndex, documentIndex]: [number, number]): Promise<WsResponse<any>> {
		try {
			const document: Document = await this.explorerController.getDocument(client, corpusIndex, documentIndex).catch(err => {
				throw err;
			});
			return { event: 'explorer/document', data: [corpusIndex, documentIndex, document ]};
		} catch (err) {
			return { event: 'explorer/error', data: err };
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
