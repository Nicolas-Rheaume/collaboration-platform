import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ContentService } from 'src/app/services/content.service';

@Component({
	selector: 'app-content-explorer-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss'],
})
export class ContentExplorerOverviewComponent implements OnInit {
	constructor(private socket: SocketService, private cs: ContentService) {}

	ngOnInit() {}

	readDocument(corpusIndex: number, documentIndex: number) {
		this.cs.selectedExplorerState.setValue(1);
		this.cs.exploringCorpusIndex = corpusIndex;
		this.cs.exploringDocumentIndex = documentIndex;
		this.socket.request('explorer/getDocument', [corpusIndex, documentIndex]);
	}
}
