import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-concept',
  templateUrl: './create-concept.component.html',
  styleUrls: ['./create-concept.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class CreateConceptComponent implements OnInit {

  private sub: Subscription;
	conceptTitle: string = '';
  conceptError: string = '';
  conceptInvalid: boolean = false;

  constructor(
    private socket: SocketService,
		private dialogRef: MatDialogRef<CreateConceptComponent>
  ) { 
    // Concept Create Error Message
		this.sub = this.socket.response('dashboard/create-response').subscribe(response => {
			if (response.success === true) {
        this.conceptError = '';
        this.conceptInvalid = false;
        this.dialogRef.close();
			} else {
        this.conceptError = response.message;
        this.conceptInvalid = true;
      }
		});
  }

  ngOnInit() {
  }

  createNewConcept() {
		console.log(this.conceptTitle.replace(/\s\s+/g, ' '));
		console.log(this.conceptTitle.match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g));
    this.socket.request('dashboard/createConcept', this.conceptTitle);
	}
}
