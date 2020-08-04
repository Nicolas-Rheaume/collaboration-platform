import { Component, OnInit, Inject } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentCreateDocumentComponent implements OnInit {
  private sub: Subscription;
	index: number = -1;
	title: string = '';
	description: string = '';
	error: string = '';
	invalid: boolean = false;

  constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private socket: SocketService, 
		private dialogRef: MatDialogRef<ContentCreateDocumentComponent>
	) {
		this.index = data.index
		this.title = data.title;
		this.description = data.description;

		// Concept Create Error Message
		this.sub = this.socket.response('editor/createDocumentError').subscribe(response => {
			if (response.success === true) {
				this.error = '';
				this.invalid = false;
				this.dialogRef.close();
			} else {
				this.error = response.message;
				this.invalid = true;
			}
		});
	}
  ngOnInit(): void { }

  	createNewDocument() {
		this.socket.request('editor/createDocument', [this.title, this.description]);
	}

	editDocument() {
		this.socket.request('editor/editDocumentAtIndex', [this.index, this.title, this.description]);
	}
}
