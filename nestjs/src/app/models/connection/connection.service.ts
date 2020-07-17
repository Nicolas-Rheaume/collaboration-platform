/*****************************************************************************
 *  CONNECTION
 *****************************************************************************/
// Dependencies
import { Injectable, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { User, UserEntity } from 'app/models/user/user.entity';
import { ConceptSort, ConceptEntity } from 'app/models/concept/concept.entity';
import { CorpusEntity } from '../corpus/corpus.entity';

// Class definition
export class Connection {
	socket?: Socket;
	path?: string;
	userEntity?: UserEntity;
	dashboardSearch?: { search: string; sort: ConceptSort };

	conceptTitle?: string;
	editorCorpus?: CorpusEntity;
	editorDocumentIndex?: number;

	explorerConcept?: ConceptEntity;
	explorerCorpusIndex?: number;
	explorerDocumentIndex?: number;

	constructor(socket: Socket) {
		this.socket = socket;
		this.path = '';
		this.userEntity = new UserEntity();
		this.dashboardSearch = { search: '', sort: ConceptSort.A_Z };
		this.editorCorpus = null;
		this.explorerConcept = null;
	}
}

/*****************************************************************************
 *  CONNECTION SERVICE
 *****************************************************************************/
@Injectable()
export class ConnectionService {
	// Variables
	private logger: Logger = new Logger('Connection Service');
	private readonly connections: Connection[] = [];

	// Create connection
	public create(socket: Socket): void {
		this.connections.push(new Connection(socket));
		this.logger.verbose(`Connected - ${this.connections.length} sockets connected`);
	}

	// Destroy connection
	public destroy(socket: Socket): void {
		this.connections.splice(this.getIndex(socket), 1);
		this.logger.debug(`Disconnected - ${this.connections.length} sockets connected`);
	}

	// Get Index
	public getIndex(socket: Socket): number {
		let index = 0;
		for (let i = 0; i < this.connections.length; i++) {
			if (this.connections[i].socket === socket) {
				index = i;
				break;
			}
		}
		return index;
	}

	// Get Connection
	public getConnection(socket: Socket): Connection {
		let connection: Connection;
		for (let i = 0; i < this.connections.length; i++) {
			if (this.connections[i].socket === socket) {
				connection = this.connections[i];
				break;
			}
		}
		return connection;
	}

	// Get User
	public getUserEntity(socket: Socket): UserEntity {
		return this.getConnection(socket).userEntity;
	}

	// Set User
	public setUserEntity(socket: Socket, userEntity: UserEntity): void {
		this.connections[this.getIndex(socket)].userEntity = userEntity;
	}

	public getEditorDocument(socket: Socket) {
		const connection: Connection = this.getConnection(socket);
		return connection.editorCorpus.documents[connection.editorDocumentIndex];
	}

	public getExplorerDocument(socket: Socket) {
		const connection: Connection = this.getConnection(socket);
		return connection.explorerConcept.corpora[connection.explorerCorpusIndex].documents[connection.explorerDocumentIndex];
	}
}
