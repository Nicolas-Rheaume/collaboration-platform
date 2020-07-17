import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';

@Component({
	selector: 'app-content-leftnav-tableofcontent',
	templateUrl: './tableofcontent.component.html',
	styleUrls: ['./tableofcontent.component.scss'],
})
export class ContentLeftnavTableofcontentComponent implements OnInit {
	constructor(private cs: ContentService) {}

	ngOnInit() {}
}
