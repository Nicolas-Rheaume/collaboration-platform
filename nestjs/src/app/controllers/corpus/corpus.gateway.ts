/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Corpus } from 'app/models/corpus/corpus.entity';

// Controllers
import { CorpusController } from 'app/controllers/corpus/corpus.controller';
import { Document } from 'app/models/document/document.entity';

/*****************************************************************************
 *  AUTHENTICATE GATEWAY
 *****************************************************************************/
@WebSocketGateway()
export class CorpusGateway implements OnGatewayInit {
	// Variables
	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('Corpus Gateway');

	// Constructor
	constructor(private controller: CorpusController) {}

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	/*****************************************************************************
	 *  CORPUS EVENTS
	 *****************************************************************************/

	// // Information
	// @SubscribeMessage('corpus/getInformation')
	// public async information(client: Socket, [title]: [string]): Promise<WsResponse<Corpus>> {
	// 	try {
	// 		let corpus = await this.controller.information(client, title).catch(err => {
	// 			throw err;
	// 		});
	// 		return { event: 'corpus/information', data: corpus };
	// 	} catch (err) {
	// 		console.log(err);
	// 		return { event: 'corpus/error', data: err };
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
