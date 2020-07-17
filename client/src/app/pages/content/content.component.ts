import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SplitComponent, AngularSplitModule, SplitAreaDirective } from 'angular-split';

import { ContentService } from 'src/app/services/content.service';
import { UserService } from 'src/app/services/user.service';

import { Corpus } from '../../models/corpus.model';
import { Text } from '../../models/text.model';
import { SocketService } from 'src/app/services/socket.service';
import { SideNavService, SideNavState, SideNavComponent, NONE_WIDTH, RAIL_WIDTH, DRAWER_WIDTH } from 'src/app/services/sidenav.service';
import { MatSidenav } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
	selector: 'app-content',
	templateUrl: './content.component.html',
	styleUrls: ['./content.component.scss'],
	animations: [
		trigger('onSideNavOpen', [
			state(
				`${SideNavState.NONE}`,
				style({
					width: `${NONE_WIDTH}px`,
				}),
			),
			state(
				`${SideNavState.RAIL}`,
				style({
					width: `${RAIL_WIDTH}px`,
				}),
			),
			state(
				`${SideNavState.DRAWER}`,
				style({
					width: `${DRAWER_WIDTH}px`,
				}),
			),
			transition('* <=> *', [animate('0.2s')]),
		]),
		trigger('onMainContentOpen', [
			state(
				`0`,
				style({
					'margin-left': '0px',
					width: `100%`,
				}),
			),
			state(
				`1`,
				style({
					'margin-left': '0px',
					width: `calc(100% - ${RAIL_WIDTH}px`,
				}),
			),
			state(
				`2`,
				style({
					'margin-left': '0px',
					width: `calc(100% - ${DRAWER_WIDTH}px`,
				}),
			),
			state(
				`3`,
				style({
					'margin-left': `${RAIL_WIDTH}px`,
					width: `calc(100% - ${RAIL_WIDTH}px`,
				}),
			),
			state(
				`4`,
				style({
					'margin-left': `${RAIL_WIDTH}px`,
					width: `calc(100% - ${2 * RAIL_WIDTH}px`,
				}),
			),
			state(
				`5`,
				style({
					'margin-left': `${RAIL_WIDTH}px`,
					width: `calc(100% - ${RAIL_WIDTH + DRAWER_WIDTH}px`,
				}),
			),
			state(
				`6`,
				style({
					'margin-left': `${DRAWER_WIDTH}px`,
					width: `calc(100% - ${DRAWER_WIDTH}px`,
				}),
			),
			state(
				`7`,
				style({
					'margin-left': `${DRAWER_WIDTH}px`,
					width: `calc(100% - ${DRAWER_WIDTH + RAIL_WIDTH}px`,
				}),
			),
			state(
				`8`,
				style({
					'margin-left': `${DRAWER_WIDTH}px`,
					width: `calc(100% - ${DRAWER_WIDTH + DRAWER_WIDTH}px`,
				}),
			),
			transition('* <=> *', [animate('0.2s')]),
		]),
	],
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

	constructor(public activeRouter: ActivatedRoute, public router: Router, public cs: ContentService, private socket: SocketService, private sidenav: SideNavService) {
		this.sidenav.leftOpened = true;
		this.sidenav.setLeftNavState(SideNavState.DRAWER);
		this.sidenav.setLeftNavComponent(SideNavComponent.CONTENT_MENU);

		this.sidenav.rightOpened = true;
		this.sidenav.setRightNavState(SideNavState.DRAWER);
		this.sidenav.setRightNavComponent(SideNavComponent.CONTENT_MENU);
	}

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
		this.sidenav.leftOpened = false;
		this.sidenav.setLeftNavState(SideNavState.NONE);
		this.sidenav.setLeftNavComponent(SideNavComponent.NONE);
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
