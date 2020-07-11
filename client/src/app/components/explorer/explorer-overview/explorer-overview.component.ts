import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-explorer-overview',
  templateUrl: './explorer-overview.component.html',
  styleUrls: ['./explorer-overview.component.scss']
})
export class ExplorerOverviewComponent implements OnInit {

  constructor(
    private socket: SocketService, 
    private cs: ContentService
  ) { }

  ngOnInit() {
  }

  readDocument(corpusIndex: number, documentIndex: number) {
    this.cs.selectedExplorerState.setValue(1);
    this.cs.exploringCorpusIndex = corpusIndex;
    this.cs.exploringDocumentIndex = documentIndex;
    this.socket.request('explorer/getDocument', [corpusIndex, documentIndex]);
  }

}
