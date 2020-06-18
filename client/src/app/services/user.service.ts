import { Injectable } from '@angular/core';
import { Subscription, observable } from 'rxjs';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User, UserRole } from '../models/user.model';
import { SocketService } from './socket.service';
import { resolve } from 'url';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/

	private sub: Subscription;
	public currentUser: User = null;
	public isAuthenticating: boolean = true;
	public token: string = null;

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(private router: Router, private socket: SocketService) {
		// User has been identified
		this.sub = this.socket.response('authenticate/validated').subscribe(({ success, token, user }) => {
			if (success === true) {
				this.isAuthenticating = false;
				this.saveUserData(token, user);
				this.router.navigate(['/']);
			}
		});

		// User has been identified
		this.sub = this.socket.response('authenticate/currentUser').subscribe(user => {
			this.isAuthenticating = false;
			this.currentUser = User.map(user);
		});

		// Check if the user's JWT token is still valid and authenticate
		if (this.tokenExists()) {
			this.authenticateToken();
		}
	}

	/*****************************************************************************
	 *  WEB SOCKETS RESPONSE
	 *****************************************************************************/
	public register(username: string, email: string, password: string) {
		this.socket.request('authenticate/register', { username: username, email: email, password: password });
	}
	public login(username: string, password: string) {
		this.socket.request('authenticate/login', { username: username, password: password });
	}
	public authenticateToken() {
		this.socket.request('authenticate/token', this.token);
	}

	/*****************************************************************************
	 *  REGISTRATION
	 ****************************************************************************/

	// Store user data in local storage
	public saveUserData(token, user) {
		localStorage.setItem('id_token', token);
		localStorage.setItem('user', JSON.stringify(user));
		this.token = token;
		this.currentUser = User.map(user);
	}

	// log out
	public logout() {
		this.token = null;
		this.currentUser = null;
		localStorage.clear();
	}

	// Check if the user is connected
	public isConnected(): boolean {
		if (this.currentUser != null) return true;
		else return false;
	}

	// Check if the user is an admin
	public isAdmin(): boolean {
		if (this.isConnected()) {
			if (this.currentUser.role === UserRole.ADMIN) return true;
			else return false;
		}
	}

	// Check if the client has a token
	public tokenExists(): boolean {
		if (!this.token) this.token = localStorage.getItem('id_token');
		if (!this.token) return false;
		else return true;
	}

	/*****************************************************************************
	 *  WEB SOCKETS REQUESTS
	 ****************************************************************************/
	public getTop5Users(username: string) {
		this.socket.request('get-top5', username);
	}
}
