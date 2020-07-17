import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavService } from 'src/app/services/sidenav.service';

@Component({
	selector: 'app-content-leftnav',
	templateUrl: './leftnav.component.html',
	styleUrls: ['./leftnav.component.scss'],
})
export class ContentLeftnavComponent implements OnInit {
	constructor(public router: Router, public sns: SideNavService) {}

	ngOnInit() {}
}
