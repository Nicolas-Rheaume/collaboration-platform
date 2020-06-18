import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { EditorController } from './editor.controller';

@WebSocketGateway()
export class EditorGateway {
	// Variables
	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('Editor Gateway');

	// Constructor
	constructor(private editorController: EditorController) {}

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	@SubscribeMessage('editor/initialize')
	public async initialize(client: Socket, url: string): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const document: Document = await this.editorController.initialize(client, url).catch(err => {
				throw err;
			});
			client.emit('editor/document', document);
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

	@SubscribeMessage('editor/updateTextAtIndex')
	public async updateTextAtIndex(client: Socket, [index, text]: [number, string]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const document: Document = await this.editorController.updateTextAtIndex(client, index, text).catch(err => {
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

	@SubscribeMessage('editor/splitTextAtIndex')
	public async splitTextAtIndex(client: Socket, [index, firstText, secondText]: [number, string, string]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const document: Document = await this.editorController.splitTextAtIndex(client, index, firstText, secondText).catch(err => {
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

	@SubscribeMessage('editor/mergeTextAtIndex')
	public async mergeTextAtIndex(client: Socket, [index]: [number]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const document: Document = await this.editorController.mergeTextAtIndex(client, index).catch(err => {
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

	@SubscribeMessage('editor/moveTextAtIndex')
	public async moveTextAtIndex(client: Socket, [from, to]: [number, number]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const document: Document = await this.editorController.moveTextAtIndex(client, from, to).catch(err => {
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

	@SubscribeMessage('editor/adoptTextAtIndex')
	public async adoptTextAtIndex(client: Socket, [from, to]: [number, number]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			await this.editorController.adoptTextAtIndex(client, from, to).catch(err => {
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
