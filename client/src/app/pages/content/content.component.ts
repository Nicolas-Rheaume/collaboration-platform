import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SplitComponent, AngularSplitModule, SplitAreaDirective } from 'angular-split';

import { CorpusService } from '../../services/corpus.service';
import { ContentService } from 'src/app/services/content.service';
import { UserService } from 'src/app/services/user.service';

import { Corpus } from '../../models/corpus.model';
import { Text } from '../../models/text.model';
import { SocketService } from 'src/app/services/socket.service';

@Component({
	selector: 'app-content',
	templateUrl: './content.component.html',
	styleUrls: ['./content.component.scss'],
	providers: [ContentService],
})
export class ContentComponent implements OnInit, OnDestroy {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private sub: Subscription;
	public corpus: Corpus = new Corpus();
	public texts: Text = new Text();

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/

	constructor(
		private activeRouter: ActivatedRoute,
		private router: Router,
		private cs: ContentService /*,
    private ss: SubjectService,
    private cs: ContentService,
    private us: UserService,
    private socketService: SocketService*/,
	) {}

	ngOnInit() {
		// Get the Active Route parameter
		/*
    this.sub = this.activeRouter.params.subscribe(params => {
      this.cs.subjectTitle = params.title;

      // Get the current User
      /*
      if(this.us.isConnected){
        this.sub = this.us.getLoggedUser().subscribe(user => {

          // Subscribe content
          this.sub = this.cs.contentResponse().subscribe(content => {
            this.subject = Subject.map(content.subject);
            console.log(this.subject);

          });

          // Get content
          this.cs.getContent(user.username, params.title);
        });
      }
      */
		/*
    });*/
	}

	ngOnDestroy() {
		//this.sub.unsubscribe();
	}

	/*****************************************************************************
	 *  EDITOR
	 ****************************************************************************/
	addNewText() {
		//this.cs.createText(this.route);
	}

	test() {
		//this.cs.test();
	}
}
