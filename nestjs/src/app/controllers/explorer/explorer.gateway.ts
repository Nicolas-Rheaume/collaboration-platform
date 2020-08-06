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
			return { event: 'explorer/document', data: [corpusIndex, documentIndex, document] };
		} catch (err) {
			return { event: 'explorer/error', data: err };
		}
	}

	@SubscribeMessage('explorer/getDocumentDiff')
	public async getDocumentDiff(client: Socket, [editorDocumentIndex, explorerCorpusIndex, explorerDocumentIndex] : [number, number, number]): Promise<WsResponse<any>> {
		try {
			console.log("");
			console.log(editorDocumentIndex);
			console.log(explorerCorpusIndex);
			console.log(explorerDocumentIndex);

			const explorerDocument: Document = await this.explorerController.getDocumentDiff(client, editorDocumentIndex, explorerCorpusIndex, explorerDocumentIndex).catch(err => {
				throw err;
			});
			return { event: 'explorer/document', data: [explorerCorpusIndex, explorerDocumentIndex, explorerDocument] };
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

	@SubscribeMessage('explorer/addDiffText')
	public async addDiffText(client: Socket, [from, to] : [number, number]): Promise<WsResponse<any>> {
		try {
			const [editorDocument, editorDocumentIndex, explorerDocument, explorerCorpusIndex, explorerDocumentIndex]: [Document, number, Document, number, number] = await this.explorerController.addDiffText(client, from, to).catch(err => {
				throw err;
			});

			client.emit('editor/document', [editorDocumentIndex, editorDocument]);
			client.emit('explorer/document', [explorerCorpusIndex, explorerDocumentIndex, explorerDocument]);
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

	@SubscribeMessage('explorer/removeDiffText')
	public async removeDiffText(client: Socket, [from, to] : [number, number]): Promise<WsResponse<any>> {
		try {
			const [editorDocument, editorDocumentIndex, explorerDocument, explorerCorpusIndex, explorerDocumentIndex]: [Document, number, Document, number, number] = await this.explorerController.removeDiffText(client, from, to).catch(err => {
				throw err;
			});

			client.emit('editor/document', [editorDocumentIndex, editorDocument]);
			client.emit('explorer/document', [explorerCorpusIndex, explorerDocumentIndex, explorerDocument]);
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

	@SubscribeMessage('explorer/updateDiffText')
	public async updateDiffText(client: Socket, [from, to] : [number, number]): Promise<WsResponse<any>> {
		try {
			const [editorDocument, editorDocumentIndex, explorerDocument, explorerCorpusIndex, explorerDocumentIndex]: [Document, number, Document, number, number] = await this.explorerController.updateDiffText(client, from, to).catch(err => {
				throw err;
			});
			client.emit('editor/document', [editorDocumentIndex, editorDocument]);
			client.emit('explorer/document', [explorerCorpusIndex, explorerDocumentIndex, explorerDocument]);
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

	
}
