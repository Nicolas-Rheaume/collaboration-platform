import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { EditorController } from './editor.controller';
import { Corpus } from 'app/entities/corpus.entity';
import { Document } from 'app/entities/document.entity';

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
	public async initialize(client: Socket, url: string): Promise<WsResponse<Corpus>> {
		try {
			const editorCorpus: Corpus = await this.editorController.initialize(client, url).catch(err => {
				throw err;
			});
			return { event: 'editor/corpus', data: editorCorpus };
		} catch (err) {
			return { event: 'editor/error', data: err };
		}
	}

	@SubscribeMessage('editor/createCorpus')
	public async createCorpus(client: Socket): Promise<WsResponse<Corpus>> {
		try {
			const editorCorpus: Corpus = await this.editorController.createCorpus(client).catch(err => {
				throw err;
			});
			return { event: 'editor/corpus', data: editorCorpus };
		} catch (err) {
			return { event: 'editor/error', data: err };
		}
	}

	@SubscribeMessage('editor/updateCorpusDescription')
	public async updateCorpusDescription(client: Socket, description: string): Promise<WsResponse<Corpus>> {
		try {
			await this.editorController
				.updateCorpusDescription(client, description)
				.catch(err => {
					throw err;
				});
			return null;
		} catch (err) {
			return { event: 'editor/error', data: err };
		}
	}

	@SubscribeMessage('editor/updateDocumentTitle')
	public async updateDocumentTitle(client: Socket, [index, title]: [number, string]): Promise<WsResponse<Corpus>> {
		try {
			await this.editorController
				.updateDocumentTitle(client, index, title)
				.catch(err => {
					throw err;
				});
			return null;
		} catch (err) {
			return { event: 'editor/error', data: err };
		}
	}

	@SubscribeMessage('editor/updateDocumentDescription')
	public async updateDocumentDescription(client: Socket, [index, description]: [number, string]): Promise<WsResponse<Corpus>> {
		try {
			await this.editorController
				.updateDocumentDescription(client, index, description)
				.catch(err => {
					throw err;
				});
			return null;
		} catch (err) {
			return { event: 'editor/error', data: err };
		}
	}

	@SubscribeMessage('editor/createDocument')
	public async createDocument(client: Socket): Promise<WsResponse<Corpus>> {
		try {
			const editorCorpus: Corpus = await this.editorController
				.createDocument(client)
				.catch(err => {
					throw err;
				});
			return { event: 'editor/corpus', data: editorCorpus };
		} catch (err) {
			return { event: 'editor/error', data: err };
		}
	}

	@SubscribeMessage('editor/getDocument')
	public async getDocument(client: Socket, index: number): Promise<WsResponse<[number, Document]>> {
		try {
			const editorDocument: Document = await this.editorController
				.getDocument(client, index)
				.catch(err => {
					throw err;
				});
			return { event: 'editor/document', data: [index, editorDocument] };
		} catch (err) {
			return { event: 'editor/error', data: err };
		}
	}

	@SubscribeMessage('editor/updateTextAtIndex')
	public async updateTextAtIndex(client: Socket, [documentIndex, textIndex, text]: [number, number, string]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			await this.editorController.updateTextAtIndex(client, documentIndex, textIndex, text).catch(err => {
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
	public async splitTextAtIndex(client: Socket, [documentIndex, textIndex, firstText, secondText]: [number, number, string, string]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			await this.editorController.splitTextAtIndex(client, documentIndex, textIndex, firstText, secondText).catch(err => {
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
	public async mergeTextAtIndex(client: Socket, [documentIndex, textIndex]: [number, number]): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			await this.editorController.mergeTextAtIndex(client, documentIndex, textIndex).catch(err => {
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

	// @SubscribeMessage('editor/moveTextAtIndex')
	// public async moveTextAtIndex(client: Socket, [from, to]: [number, number]): Promise<WsResponse<{ success: boolean; message: string }>> {
	// 	try {
	// 		const document: Document = await this.editorController.moveTextAtIndex(client, from, to).catch(err => {
	// 			throw err;
	// 		});
	// 		return {
	// 			event: 'editor/error',
	// 			data: {
	// 				success: true,
	// 				message: '',
	// 			},
	// 		};
	// 	} catch (err) {
	// 		return {
	// 			event: 'editor/error',
	// 			data: {
	// 				success: false,
	// 				message: err,
	// 			},
	// 		};
	// 	}
	// }

	// @SubscribeMessage('editor/adoptTextAtIndex')
	// public async adoptTextAtIndex(client: Socket, [from, to]: [number, number]): Promise<WsResponse<{ success: boolean; message: string }>> {
	// 	try {
	// 		await this.editorController.adoptTextAtIndex(client, from, to).catch(err => {
	// 			throw err;
	// 		});
	// 		return {
	// 			event: 'editor/error',
	// 			data: {
	// 				success: true,
	// 				message: '',
	// 			},
	// 		};
	// 	} catch (err) {
	// 		return {
	// 			event: 'editor/error',
	// 			data: {
	// 				success: false,
	// 				message: err,
	// 			},
	// 		};
	// 	}
	// }
}
