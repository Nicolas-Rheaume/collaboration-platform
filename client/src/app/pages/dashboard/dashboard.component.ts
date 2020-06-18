import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Corpus, CorpusSort } from 'src/app/models/corpus.model';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { SocketService } from 'src/app/services/socket.service';

declare var $: any;

@Component({
	selector: 'app-dasboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private sub: Subscription;

	corpora: Corpus[] = [] as Corpus[];

	// Search
	searchTitle: String = '';
	searchSort: CorpusSort = CorpusSort.A_Z;
	sortOptions: CorpusSort[] = [
		CorpusSort.A_Z,
		CorpusSort.Z_A,
		CorpusSort.OLDEST,
		CorpusSort.NEWEST,
		CorpusSort.MOST_CONTRIBUTOR,
		CorpusSort.LEAST_CONTRIBUTOR,
		CorpusSort.MOST_TEXTS,
		CorpusSort.LEAST_TEXTS,
	];

	// Create corpus
	createCorpusTitle: string = '';
	createCorpusError: string = '';
	createCorpusInvalid: boolean = false;
	/*
  corpusCreated: boolean = true;
  corpusCreatedMessage: string = "";
  */

	contributorUsername: string = '';

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(private router: Router, private us: UserService, private socket: SocketService) {
		// Get Pages

		// Get the Corpora
		this.sub = this.socket.response('dashboard/corpora').subscribe((corpora: Corpus[]) => {
			this.corpora = Corpus.maps(corpora);
		});

		// Corpus Error Message
		this.sub = this.socket.response('dashboard/create-error').subscribe(response => {
			if (response.success === true) {
				this.createCorpusTitle = '';
				this.createCorpusError = '';
				this.createCorpusInvalid = false;
				$('#createCorpus').modal('hide');
			} else {
				this.createCorpusError = response.message;
				this.createCorpusInvalid = true;
			}
		});

		// Send Search Options
		this.sub = this.socket.response('dashboard/search').subscribe(({ search, sort }) => {
			this.searchTitle = search;
			this.searchSort = sort;
		});
	}

	ngOnInit() {
		this.socket.request('dashboard/getCorpora', null);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	/*****************************************************************************
	 *  CREATE DIALOG
	 ****************************************************************************/
	openModal() {
		$('#createCorpus').modal('show');
	}

	closeModal() {
		this.createCorpusInvalid = false;
		this.createCorpusTitle = '';
		$('#createCorpus').modal('hide');
	}

	createNewCorpus() {
		console.log(this.createCorpusTitle.replace(/\s\s+/g, ' '));
		console.log(this.createCorpusTitle.match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g));
		this.socket.request('dashboard/createCorpus', this.createCorpusTitle);
	}

	viewCorpus(corpus: Corpus): void {
		this.router.navigate(['/content', corpus.url]);
	}

	modifyCorpus(index: number): void {
		$('#createCorpus').modal('show');
		//this.socket.request('dashboard/deleteCorpus', this.corpora[index].title);
	}

	removeCorpus(index: number): void {
		this.socket.request('dashboard/deleteCorpus', this.corpora[index].title);
	}

	/*****************************************************************************
	 *  SEARCH SUBJECTS
	 ****************************************************************************/
	searchCorpora(): void {
		this.socket.request('dashboard/searchCorpora', {
			title: this.searchTitle,
			sort: this.searchSort,
		});
	}

	searchContributors(): void {}
}
