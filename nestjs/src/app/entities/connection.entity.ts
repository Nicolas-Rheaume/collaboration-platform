/*****************************************************************************
 *  CONNECTION CLASS
 *****************************************************************************/
// Dependencies
import { Socket } from 'socket.io';
import { User, UserEntity } from 'app/entities/user.entity';
import { ConceptSort } from 'app/entities/concept.entity';
import { DocumentEntity } from './document.entity';
import { TextEntity } from './text.entity';

// Class definition
export class Connection {
	socket?: Socket;
	path?: string;
	userEntity?: UserEntity;
	dashboardSearch?: { search: string; sort: ConceptSort };
	editorEntity?: DocumentEntity;
	explorerTexts?: TextEntity[];

	constructor(socket: Socket) {
		this.socket = socket;
		this.path = '';
		this.userEntity = new UserEntity();
		this.dashboardSearch = { search: '', sort: ConceptSort.A_Z };
		this.editorEntity = null;
		this.explorerTexts = [];
	}
}
