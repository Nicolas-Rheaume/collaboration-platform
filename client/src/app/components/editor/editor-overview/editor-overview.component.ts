import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-editor-overview',
  templateUrl: './editor-overview.component.html',
  styleUrls: ['./editor-overview.component.scss']
})
export class EditorOverviewComponent implements OnInit {

  constructor(
    private socket: SocketService,
    private cs: ContentService
  ) { 
    
  }

  ngOnInit() {
  }

  descriptionChange() {
    this.socket.request('editor/updateCorpusDescription', this.cs.editorCorpus.description);
  }

  createDocument() {
    this.socket.request('editor/createDocument', null);
  }



}
