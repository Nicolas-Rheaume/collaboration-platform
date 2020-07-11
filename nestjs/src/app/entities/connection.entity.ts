/*****************************************************************************
 *  CONNECTION CLASS
 *****************************************************************************/
// Dependencies
import { Socket } from 'socket.io';
import { User, UserEntity } from 'app/entities/user.entity';
import { ConceptSort, ConceptEntity } from 'app/entities/concept.entity';
import { DocumentEntity } from './document.entity';
import { TextEntity } from './text.entity';
import { CorpusEntity } from './corpus.entity';

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
