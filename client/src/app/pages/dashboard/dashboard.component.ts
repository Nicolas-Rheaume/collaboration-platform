import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CorpusService } from 'src/app/services/corpus.service';
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
	//newCorpus: Corpus = new Corpus();
	corpora: Corpus[] = [] as Corpus[];
	contributors: User[] = [] as User[];

	// Search
	searchTitle: String = '';
	sortOptions: String[] = ['A - Z', 'Z - A', 'Oldest', 'Newest', 'Most Contributors', 'Least Contributors', 'Most Texts', 'Least Texts'];
	searchSort: String = 'none';
	searchContributor: String = '';

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
	constructor(private router: Router, private ss: CorpusService, private us: UserService, private socket: SocketService) {

		// Get Pages

		// Corpus Error Message
		this.sub = this.socket.response('dashboard/create-error').subscribe(message => {
			if (message == null) {
				this.createCorpusTitle = '';
				this.createCorpusError = '';
				this.createCorpusInvalid = false;
				$('#createCorpus').modal('hide');
			} else {
				this.createCorpusError = message;
				this.createCorpusInvalid = true;
			}
		});

		/*
    this.sub = this.ss.getAllCorporaResponse().subscribe(corpora => {
      console.log(corpora);
      this.corpora = Corpus.maps(corpora);
      console.log(this.corpora);
    });


    this.sub = this.ss.update().subscribe(corpora => {
      console.log(corpora);
      this.corpora = Corpus.maps(corpora);
      console.log(corpora);
    });

    this.sub = this.us.get().subscribe(users => {
      this.contributors = User.maps(users);
    });
    */
	}

	ngOnInit() {
		this.socket.request('dashboard/findAllPages', {
			title: this.searchTitle,
			sort: this.searchSort,
		});
		/*
    this.ss.getDashboardCorpora();
    this.us.getTop5Users(this.contributorUsername);*/
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
		this.socket.request('dashboard/createPage', this.createCorpusTitle);
	}

	viewCorpus(corpus: Corpus): void {
		this.router.navigate(['/content', corpus.url]);
	}

	removeCorpus(index: number): void {
		this.socket.request('dashboard/deletePage', this.ss.corpora[index].title);
	}

	/*****************************************************************************
	 *  SEARCH SUBJECTS
	 ****************************************************************************/
	searchCorpora(): void {
		this.socket.request('corpus/search', {
			title: this.searchTitle,
			sort: this.searchSort,
		});
	}

	getContributors(): void {
		console.log(this.searchContributor);
	}

	searchContributors(): void {}
}
