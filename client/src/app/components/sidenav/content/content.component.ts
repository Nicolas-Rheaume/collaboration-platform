import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'content-sidenav',
	templateUrl: './content.component.html',
	styleUrls: ['./content.component.scss'],
})
export class ContentSideNav implements OnInit {
	constructor(public cs: ContentService) {}

	ngOnInit() {}
}
