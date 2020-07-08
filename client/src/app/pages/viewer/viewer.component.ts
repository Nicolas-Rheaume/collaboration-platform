import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { Document } from 'src/app/models/document.model';

@Component({
	selector: 'app-viewer',
	templateUrl: './viewer.component.html',
	styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private sub: Subscription;
	private title: string;
	private user: string;

	private document: Document = null;
	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(public activeRouter: ActivatedRoute, public router: Router, private socket: SocketService) {
		this.sub = this.activeRouter.params.subscribe(params => {
			this.title = params.title;
			this.user = params.user;

			// Get Information
			this.sub = this.socket.response('document/document').subscribe(document => {
				console.log(document);
				this.document = document;
				console.log(this.document);
			});

			// Request Corpus Information
			this.socket.request('document/getDocument', [this.title, this.user]);
		});
	}

	ngOnInit() {}

	scroll(el: HTMLElement) {
		el.scrollIntoView({ behavior: 'smooth' });
	}
}
