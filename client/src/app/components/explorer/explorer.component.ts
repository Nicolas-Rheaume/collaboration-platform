import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import { ContentService } from '../../services/content.service';
import { Text } from 'src/app/models/text.model';
import { SocketService } from 'src/app/services/socket.service';

@Component({
	selector: 'app-explorer',
	templateUrl: './explorer.component.html',
	styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit, OnDestroy {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	public description: string;
	//public Editor = DecoupledEditor;

	public explorerTexts: Text[] = [];

	done: string[] = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(private socket: SocketService, private activeRouter: ActivatedRoute, private router: Router, private cs: ContentService) {
		// Set the corpus to the client
		this.sub = this.activeRouter.params.subscribe(async params => {
			this.corpusTitle = params.title;
			await this.socketResponse();
		});
	}

	ngOnInit() {}

	ngOnDestroy() {}

	/*****************************************************************************
	 *  SOCKET
	 ****************************************************************************/

	// Variables
	sub: Subscription;
	corpusTitle: string = '';

	// Socket Response
	private async socketResponse(): Promise<void> {
		// Editor Error Message
		this.sub = this.socket.response('explorer/error').subscribe(response => {
			if (response.success === false) console.log(response.message);
		});

		// Editor Document
		this.sub = this.socket.response('explorer/texts').subscribe((texts: Text[]) => {
			this.explorerTexts = texts;
		});

		// Initialize the Document
		this.socket.request('explorer/initialize', this.corpusTitle);
	}

	/*****************************************************************************
	 *  DRAGGABLE
	 ****************************************************************************/
	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			this.socket.request('explorer/moveTextAtIndex', [event.previousIndex, event.currentIndex]);
		} else {
			transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
		}
	}

	noReturnPredicate() {
		return false;
	}
}
