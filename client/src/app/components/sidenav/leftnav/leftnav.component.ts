import { Component, OnInit } from '@angular/core';
import { Routes, Router, NavigationEnd } from '@angular/router';
import { NotfoundSideNav } from 'src/app/sidenavs/notfound/notfound.component';
import { SideNavService, SideNavComponent } from 'src/app/services/sidenav.service';

@Component({
	selector: 'leftnav-router',
	templateUrl: './leftnav.component.html',
	styleUrls: ['./leftnav.component.scss'],
})
export class LeftnavComponent implements OnInit {

	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(
		public router: Router, 
		public sidenav: SideNavService
	) {
	}

	ngOnInit() {}

	getComponent(page: string): boolean {
		/*
		if (this.url.substring(0, 7) == '/viewer' && page == 'table of content') {
			return true;
		} else {
			return false;
		}
		*/
		return false;
	}
}
