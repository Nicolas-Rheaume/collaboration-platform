import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SocketService } from './services/socket.service';

import { MatSidenav } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SideNavState, NONE_WIDTH, RAIL_WIDTH, DRAWER_WIDTH, SideNavService } from 'src/app/services/sidenav.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [
		trigger('onSideNavOpen', [
			state(
				`${SideNavState.NONE}`,
				style({
					width: `${NONE_WIDTH}px`,
				}),
			),
			state(
				`${SideNavState.RAIL}`,
				style({
					width: `${RAIL_WIDTH}px`,
				}),
			),
			state(
				`${SideNavState.DRAWER}`,
				style({
					width: `${DRAWER_WIDTH}px`,
				}),
			),
			transition('* <=> *', [animate('0.2s')]),
		]),
		trigger('onMainContentOpen', [
			state(
				`0`,
				style({
					'margin-left': '0px',
					width: `100%`,
				}),
			),
			state(
				`1`,
				style({
					'margin-left': '0px',
					width: `calc(100% - ${RAIL_WIDTH}px`,
				}),
			),
			state(
				`2`,
				style({
					'margin-left': '0px',
					width: `calc(100% - ${DRAWER_WIDTH}px`,
				}),
			),
			state(
				`3`,
				style({
					'margin-left': `${RAIL_WIDTH}px`,
					width: `calc(100% - ${RAIL_WIDTH}px`,
				}),
			),
			state(
				`4`,
				style({
					'margin-left': `${RAIL_WIDTH}px`,
					width: `calc(100% - ${2 * RAIL_WIDTH}px`,
				}),
			),
			state(
				`5`,
				style({
					'margin-left': `${RAIL_WIDTH}px`,
					width: `calc(100% - ${RAIL_WIDTH + DRAWER_WIDTH}px`,
				}),
			),
			state(
				`6`,
				style({
					'margin-left': `${DRAWER_WIDTH}px`,
					width: `calc(100% - ${DRAWER_WIDTH}px`,
				}),
			),
			state(
				`7`,
				style({
					'margin-left': `${DRAWER_WIDTH}px`,
					width: `calc(100% - ${DRAWER_WIDTH + RAIL_WIDTH}px`,
				}),
			),
			state(
				`8`,
				style({
					'margin-left': `${DRAWER_WIDTH}px`,
					width: `calc(100% - ${DRAWER_WIDTH + DRAWER_WIDTH}px`,
				}),
			),
			transition('* <=> *', [animate('0.2s')]),
		]),
	],
})
export class AppComponent {
	constructor(router: Router, socket: SocketService, public sidenav: SideNavService) {
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
