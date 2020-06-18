import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '../../services/user.service';
import { SocketService } from 'src/app/services/socket.service';

import { User, UserRole } from '../../models/user.model';

@Component({
	selector: 'app-administration',
	templateUrl: './administration.component.html',
	styleUrls: ['./administration.component.scss'],
})
export class AdministrationComponent implements OnInit {
	/*****************************************************************************
	 *  VARIABLES
	 *****************************************************************************/
	private sub: Subscription;
	users: User[] = [] as User[];
	newUser: User = new User();
	message: String;

	data: any = [];

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(private us: UserService, private socket: SocketService) {
		// Get all users
		this.sub = this.socket.response('user/all-users').subscribe(data => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].hasOwnProperty('user') === true) this.users.push(User.map(data[i].user));
				else this.users.push(new User());
			}
			this.data = data;
		});
	}

	ngOnInit() {
		this.socket.request('get-all', {});
		this.socket.request('user/connectedUsers', {});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	/*****************************************************************************
	 *  REGISTRATION
	 *****************************************************************************/
}
