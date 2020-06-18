import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SocketService } from './services/socket.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor(router: Router, socket: SocketService) {
		let url = router.url;
		socket.request('path', url);

		router.events.forEach(event => {
			if (event instanceof NavigationEnd) {
				let url = router.url;
				socket.request('path', url);
			}
		});
	}
}
