import { Component, OnInit } from '@angular/core';
import { Corpus } from 'src/app/models/corpus.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
	selector: 'app-corpus',
	templateUrl: './corpus.component.html',
	styleUrls: ['./corpus.component.scss'],
})
export class CorpusComponent implements OnInit {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private sub: Subscription;
	private title: string = '';
	public corpus: Corpus = null;

	public name: string = 'test';
	public count: number = 0;
	public check: boolean = false;

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(public activeRouter: ActivatedRoute, public router: Router, private socket: SocketService) {
		this.sub = this.activeRouter.params.subscribe(params => {
			this.title = params.title;

			// Get Information
			this.sub = this.socket.response('corpus/information').subscribe(corpus => {
				this.corpus = corpus;
			});

			// Request Corpus Information
			this.socket.request('corpus/getInformation', [this.title]);
		});
	}

	ngOnInit() {}
}
