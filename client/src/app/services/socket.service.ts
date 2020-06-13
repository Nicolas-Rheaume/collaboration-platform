import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class SocketService {
	// Variables
	private socket: SocketIOClient.Socket = io(environment.api);

	// Constructor
	constructor(private router: Router) {}

	// Socket request
	public request(event: string, data: any): void {
		this.socket.emit(event, data);
	}

	// Socket response
	public response(event: string): Observable<any> {
		return Observable.create(observer => {
			this.socket.on(event, data => {
				observer.next(data);
			});
		});
	}
}
