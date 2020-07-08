import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'content-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class ContentEditor implements OnInit, OnDestroy {
  /*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private sub: Subscription;

  constructor(
    private socket: SocketService, 
    private activeRouter: ActivatedRoute,
    private cs: ContentService
  ) { 
  }

  ngOnInit() {
    console.log("Editor Created");
    this.sub = this.activeRouter.params.subscribe(params => {
      this.cs.initializeEditor(params.title);
    });
  }

  ngOnDestroy() {
    console.log("Editor Destroyed");
  }

}
