import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { DashboardController } from 'app/controllers/dashboard/dashboard.controller';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { Corpus, CorpusSort } from 'app/entities/corpus.entity';

@WebSocketGateway()
export class DashboardGateway implements OnGatewayInit {
	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('Dashboard Gateway');

	constructor(private dashController: DashboardController) {}

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	// Create a new Corpus
	@SubscribeMessage('dashboard/createCorpus')
	public async create(client: Socket, title: string): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const corpora: Corpus[] = await this.dashController.createCorpus(client, title).catch(err => {
				throw err;
			});
			this.wss.emit('dashboard/corpora', corpora);
			return {
				event: 'dashboard/create-error',
				data: {
					success: true,
					message: '',
				},
			};
		} catch (err) {
			return {
				event: 'dashboard/create-error',
				data: {
					success: false,
					message: err,
				},
			};
		}
	}

	// Delete a Corpus
	@SubscribeMessage('dashboard/deleteCorpus')
	public async delete(client: Socket, title: string): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const corpora: Corpus[] = await this.dashController.deleteCorpus(client, title).catch(err => {
				throw err;
			});
			this.wss.emit('dashboard/corpora', corpora);
			return {
				event: 'dashboard/error',
				data: {
					success: true,
					message: '',
				},
			};
		} catch (err) {
			return {
				event: 'dashboard/error',
				data: {
					success: false,
					message: err,
				},
			};
		}
	}

	// Find all corpora
	@SubscribeMessage('dashboard/getCorpora')
	public async getCorpora(client: Socket): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const [corpora, search, sort] = await this.dashController.findAll(client).catch(err => {
				throw err;
			});
			client.emit('dashboard/corpora', corpora);
			client.emit('dashboard/search', { search, sort });
			return {
				event: 'dashboard/error',
				data: {
					success: true,
					message: '',
				},
			};
		} catch (err) {
			return {
				event: 'dashboard/error',
				data: {
					success: false,
					message: err,
				},
			};
		}
	}

	// Find all corpora
	@SubscribeMessage('dashboard/searchCorpora')
	public async searchCorpora(client: Socket, { title, sort }): Promise<WsResponse<{ success: boolean; message: string }>> {
		try {
			const corpora: Corpus[] = await this.dashController.searchCorpora(client, title, sort).catch(err => {
				throw err;
			});
			client.emit('dashboard/corpora', corpora);
			return {
				event: 'dashboard/error',
				data: {
					success: true,
					message: '',
				},
			};
		} catch (err) {
			return {
				event: 'dashboard/error',
				data: {
					success: false,
					message: err,
				},
			};
		}
	}
}
