import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ContentService } from 'src/app/services/content.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-content-explorer-corpus',
	templateUrl: './corpus.component.html',
	styleUrls: ['./corpus.component.scss'],
})
export class ContentExplorerCorpusComponent implements OnInit {
	constructor(private socket: SocketService, private cs: ContentService) {}

	ngOnInit() {}

	readDocument(corpusIndex: number, documentIndex: number) {
		this.cs.selectedExplorerState.setValue(1);
		this.cs.exploringCorpusIndex = corpusIndex;
		this.cs.exploringDocumentIndex = documentIndex;
		this.socket.request('explorer/getDocument', [corpusIndex, documentIndex]);
	}

	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
		}
	}
}
