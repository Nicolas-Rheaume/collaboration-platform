import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavService } from 'src/app/services/sidenav.service';
import { SocketService } from 'src/app/services/socket.service';
import { ContentService } from 'src/app/services/content.service';

@Component({
	selector: 'app-content-rightnav',
	templateUrl: './rightnav.component.html',
	styleUrls: ['./rightnav.component.scss'],
})
export class ContentRightnavComponent implements OnInit {
	constructor(public router: Router, public sns: SideNavService, private socket: SocketService, private cs: ContentService) {}

	ngOnInit() {}
}
