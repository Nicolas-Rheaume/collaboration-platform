import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ContentService } from 'src/app/services/content.service';

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

  showHandle(index: number) {
    this.showHandles[index] = true;
  }

  hideHandle(index: number) {
    this.showHandles[index] = false;
  }

}
