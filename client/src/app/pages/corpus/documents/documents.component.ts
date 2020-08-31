import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { Document } from 'src/app/models/document.model';

export interface Fruit {
	name: string;
}

@Component({
	selector: 'app-corpus-documents',
	templateUrl: './documents.component.html',
	styleUrls: ['./documents.component.scss'],
})
export class CorpusDocumentsComponent implements OnInit {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private sub: Subscription;
	private title: string;

	private documents: Document[] = null;
	panelOpenState = false;

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(public activeRouter: ActivatedRoute, public router: Router, private socket: SocketService) {
		this.sub = this.activeRouter.params.subscribe(params => {
			this.title = params.title;

			// Get Information
			this.sub = this.socket.response('corpus/documents').subscribe(documents => {
				console.log(documents);
				this.documents = documents;
			});

			// Request Corpus Information
			this.socket.request('corpus/getDocuments', [this.title]);
		});
	}

	ngOnInit() {}

	test() {
		console.log('asd');
	}

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/

	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	fruits: Fruit[] = [];

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our fruit
		if ((value || '').trim()) {
			this.fruits.push({ name: value.trim() });
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	remove(fruit: Fruit): void {
		const index = this.fruits.indexOf(fruit);

		if (index >= 0) {
			this.fruits.splice(index, 1);
		}
	}

	// MatPaginator Inputs
	length = 100;
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 25, 100];

	// MatPaginator Output
	pageEvent: PageEvent;

	setPageSizeOptions(setPageSizeOptionsInput: string) {
		if (setPageSizeOptionsInput) {
			this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
		}
	}
}
