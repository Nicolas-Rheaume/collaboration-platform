/*****************************************************************************
 *  CONNECTION CLASS
 *****************************************************************************/
// Dependencies
import { Socket } from 'socket.io';
import { User, UserEntity } from 'app/entities/user.entity';
import { CorpusSort } from 'app/entities/corpus.entity';

// Class definition
export class Connection {
	socket?: Socket;
	path?: string;
	userEntity?: UserEntity;
	dashboardSearch?: { search: string; sort: CorpusSort };

	constructor(socket: Socket) {
		this.socket = socket;
		this.path = '';
		this.userEntity = new UserEntity();
		this.dashboardSearch = { search: '', sort: CorpusSort.A_Z };
	}
}
