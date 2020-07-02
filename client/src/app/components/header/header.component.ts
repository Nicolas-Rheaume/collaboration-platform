import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SideNavService } from 'src/app/services/sidenav.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	username: string = null;

	constructor(public us: UserService, public sidenav: SideNavService) {}

	ngOnInit() {}
}
