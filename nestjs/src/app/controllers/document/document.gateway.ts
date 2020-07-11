/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Corpus } from 'app/entities/corpus.entity';

// Controllers
import { DocumentController } from 'app/controllers/document/document.controller';
import { Document } from 'app/entities/document.entity';

/*****************************************************************************
 *  AUTHENTICATE GATEWAY
 *****************************************************************************/
@WebSocketGateway()
export class DocumentGateway implements OnGatewayInit {
	// Variables
	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('Document Gateway');

	// Constructor
	constructor(private controller: DocumentController) {}

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	/*****************************************************************************
	 *  CORPUS EVENTS
	 *****************************************************************************/

	// // Information
	// @SubscribeMessage('document/getDocument')
	// public async document(client: Socket, [title, user]: [string, string]): Promise<WsResponse<Document>> {
	// 	try {
	// 		let document = await this.controller.document(client, title, user).catch(err => {
	// 			throw err;
	// 		});
	// 		return { event: 'document/document', data: document };
	// 	} catch (err) {
	// 		console.log(err);
	// 		return { event: 'document/error', data: err };
	// 	}
	// }

	// // Information
	// @SubscribeMessage('corpus/getDocuments')
	// public async documents(client: Socket, [title]: [string]): Promise<WsResponse<Document[]>> {
	// 	try {
	// 		const documents: Document[] = await this.controller.documents(client, title).catch(err => {
	// 			throw err;
	// 		});
	// 		return { event: 'corpus/documents', data: documents };
	// 	} catch (err) {
	// 		console.log(err);
	// 		return { event: 'corpus/error', data: err };
	// 	}
	// }

	// // Register
	// @SubscribeMessage('authenticate/register')
	// public async register(client: Socket, { username, email, password }): Promise<WsResponse<string>> {
	// 	try {
	// 		const userEntity = await this.controller.register(username, email, password).catch(err => {
	// 			throw err;
	// 		});
	// 		const response = await this.controller.login(client, username, password).catch(err => {
	// 			throw err;
	// 		});
	// 		return { event: 'authenticate/validated', data: response };
	// 	} catch (err) {
	// 		return { event: 'authenticate/register-error', data: err };
	// 	}
	// }
}
