import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ContentService } from 'src/app/services/content.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  showHandles: boolean[] = [];

  constructor(
    private socket: SocketService, 
    private cs: ContentService
  ) { 
    this.showHandles = new Array<boolean>(this.cs.explorerConcept.corpora[this.cs.exploringCorpusIndex].documents[this.cs.exploringDocumentIndex].texts.length);
    this.showHandles.forEach(show => show = false);
  }

  ngOnInit() {
  }
  
  /*****************************************************************************
	 *  DRAGGABLE
	 ****************************************************************************/
	drop(event: CdkDragDrop<string[]>) {
    console.log("explorer");
    console.log(event);
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			this.socket.request('explorer/moveTextAtIndex', [event.previousIndex, event.currentIndex]);
		} else {
      console.log("transfering items");
			transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
		}
	}

	noReturnPredicate() {
		return false;
	}

}
