import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { DashboardController } from 'app/controllers/dashboard/dashboard.controller';
import { Concept } from 'app/models/concept/concept.entity';

@WebSocketGateway()
export class DashboardGateway implements OnGatewayInit {

	/*****************************************************************************
	 *  VARIABLES
	 *****************************************************************************/
	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('Dashboard Gateway');

	/*****************************************************************************
	 *  MAIN
	 *****************************************************************************/
	constructor(private dashboardController: DashboardController) {}

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	/*****************************************************************************
	 *  EVENTS
	 *****************************************************************************/
	// Create a new Corpus
	@SubscribeMessage('dashboard/createConcept')
	public async create(client: Socket, title: string): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const concepts: Concept[] = await this.dashboardController.createConcept(client, title).catch(err => {
				throw err;
			});
			client.emit('dashboard/concepts', concepts);
			return { event: 'dashboard/create-response', data: { success: true, message: '', } };
		} catch (err) {
			console.log(err);
			return { event: 'dashboard/create-response', data: { success: false, message: err, } };
		}
	}

	// Delete a Corpus
	@SubscribeMessage('dashboard/deleteConcept')
	public async delete(client: Socket, title: string): Promise<WsResponse<Concept[]>> {
		try {
			const concepts: Concept[] = await this.dashboardController.deleteConcept(client, title).catch(err => {
				throw err;
			});
			return { event: 'dashboard/concepts', data: concepts };
		} catch (err) {
			return { event: 'dashboard/error', data: err };
		}
	}

	// Find all corpora
	@SubscribeMessage('dashboard/findConcepts')
	public async getCorpora(client: Socket): Promise<WsResponse<Concept[]>> {
		try {
			const [concepts, search, sort] = await this.dashboardController.findAllConcepts(client).catch(err => {
				throw err;
			});
			client.emit('dashboard/search', { search, sort });
			return { event: 'dashboard/concepts', data: concepts };
		} catch (err) {
			return { event: 'dashboard/error', data: err };
		}
	}

	// Find all corpora
	@SubscribeMessage('dashboard/searchConcepts')
	public async searchCorpora(client: Socket, { title, sort }): Promise<WsResponse<Concept[]>> {
		try {
			const concepts: Concept[] = await this.dashboardController.searchConcepts(client, title, sort).catch(err => {
				throw err;
			});
			return { event: 'dashboard/concepts', data: concepts };
		} catch (err) {
			return { event: 'dashboard/error', data: err };
		}
	}

	// // Create a new Corpus
	// @SubscribeMessage('dashboard/createCorpus')
	// public async create(client: Socket, title: string): Promise<WsResponse<{ success: boolean; message: string }>> {
	// 	try {
	// 		const corpora: Corpus[] = await this.dashController.createCorpus(client, title).catch(err => {
	// 			throw err;
	// 		});
	// 		this.wss.emit('dashboard/corpora', corpora);
	// 		return {
	// 			event: 'dashboard/create-error',
	// 			data: {
	// 				success: true,
	// 				message: '',
	// 			},
	// 		};
	// 	} catch (err) {
	// 		return {
	// 			event: 'dashboard/create-error',
	// 			data: {
	// 				success: false,
	// 				message: err,
	// 			},
	// 		};
	// 	}
	// }

	// // Delete a Corpus
	// @SubscribeMessage('dashboard/deleteCorpus')
	// public async delete(client: Socket, title: string): Promise<WsResponse<{ success: boolean; message: string }>> {
	// 	try {
	// 		const corpora: Corpus[] = await this.dashController.deleteCorpus(client, title).catch(err => {
	// 			throw err;
	// 		});
	// 		this.wss.emit('dashboard/corpora', corpora);
	// 		return {
	// 			event: 'dashboard/error',
	// 			data: {
	// 				success: true,
	// 				message: '',
	// 			},
	// 		};
	// 	} catch (err) {
	// 		return {
	// 			event: 'dashboard/error',
	// 			data: {
	// 				success: false,
	// 				message: err,
	// 			},
	// 		};
	// 	}
	// }

	// // Find all corpora
	// @SubscribeMessage('dashboard/getCorpora')
	// public async getCorpora(client: Socket): Promise<WsResponse<{ success: boolean; message: string }>> {
	// 	try {
	// 		const [corpora, search, sort] = await this.dashController.findAll(client).catch(err => {
	// 			throw err;
	// 		});
	// 		client.emit('dashboard/corpora', corpora);
	// 		client.emit('dashboard/search', { search, sort });
	// 		return {
	// 			event: 'dashboard/error',
	// 			data: {
	// 				success: true,
	// 				message: '',
	// 			},
	// 		};
	// 	} catch (err) {
	// 		return {
	// 			event: 'dashboard/error',
	// 			data: {
	// 				success: false,
	// 				message: err,
	// 			},
	// 		};
	// 	}
	// }

	// // Find all corpora
	// @SubscribeMessage('dashboard/searchCorpora')
	// public async searchCorpora(client: Socket, { title, sort }): Promise<WsResponse<{ success: boolean; message: string }>> {
	// 	try {
	// 		const corpora: Corpus[] = await this.dashController.searchCorpora(client, title, sort).catch(err => {
	// 			throw err;
	// 		});
	// 		client.emit('dashboard/corpora', corpora);
	// 		return {
	// 			event: 'dashboard/error',
	// 			data: {
	// 				success: true,
	// 				message: '',
	// 			},
	// 		};
	// 	} catch (err) {
	// 		return {
	// 			event: 'dashboard/error',
	// 			data: {
	// 				success: false,
	// 				message: err,
	// 			},
	// 		};
	// 	}
	// }
}
