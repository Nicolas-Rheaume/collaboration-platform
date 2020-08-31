import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Concept, ConceptSort } from 'src/app/models/concept.model';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { SocketService } from 'src/app/services/socket.service';
import { MatDialog } from '@angular/material';
import { CreateConceptComponent } from './create-concept/create-concept.component';

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
	concepts: Concept[] = [] as Concept[];

	// Search
	searchTitle: String = '';
	searchSort: ConceptSort = ConceptSort.A_Z;
	sortOptions: ConceptSort[] = [
		ConceptSort.A_Z,
		ConceptSort.Z_A,
		ConceptSort.OLDEST,
		ConceptSort.NEWEST,
		ConceptSort.MOST_CONTRIBUTOR,
		ConceptSort.LEAST_CONTRIBUTOR,
		ConceptSort.MOST_TEXTS,
		ConceptSort.LEAST_TEXTS,
	];

	// Create concept
	createConceptTitle: string = '';
	createConceptError: string = '';
	createConceptInvalid: boolean = false;

	contributorUsername: string = '';

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(private router: Router, private us: UserService, private socket: SocketService, private dialog: MatDialog) {
		// Get Pages

		// Get the Concepts
		this.sub = this.socket.response('dashboard/concepts').subscribe((concepts: Concept[]) => {
			//this.concepts = Concept.maps(concepts);
			console.log(concepts);
			this.concepts = concepts;
		});

		// Concept Create Error Message
		this.sub = this.socket.response('dashboard/create-error').subscribe(response => {
			if (response.success === true) {
				this.createConceptTitle = '';
				this.createConceptError = '';
				this.createConceptInvalid = false;
				$('#createConcept').modal('hide');
			} else {
				this.createConceptError = response.message;
				this.createConceptInvalid = true;
			}
		});

		// Concept Error Message
		this.sub = this.socket.response('dashboard/error').subscribe(error => {
			console.log(error);
		});

		// Send Search Options
		this.sub = this.socket.response('dashboard/search').subscribe(({ search, sort }) => {
			this.searchTitle = search;
			this.searchSort = sort;
		});
	}

	ngOnInit() {
		this.socket.request('dashboard/findConcepts', null);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	/*****************************************************************************
	 *  CREATE DIALOG
	 ****************************************************************************/

	openDialog() {
		this.dialog.open(CreateConceptComponent);
	}

	// openModal() {
	// 	$('#createConcept').modal('show');
	// }

	// closeModal() {
	// 	this.createConceptInvalid = false;
	// 	this.createConceptTitle = '';
	// 	$('#createConcept').modal('hide');
	// }

	// createNewConcept() {
	// 	console.log(this.createConceptTitle.replace(/\s\s+/g, ' '));
	// 	console.log(this.createConceptTitle.match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g));
	// 	this.socket.request('dashboard/createConcept', this.createConceptTitle);
	// }

	viewConcept(concept: Concept): void {
		this.router.navigate(['/content', concept.url]);
	}

	modifyConcept(index: number): void {
		$('#createConcept').modal('show');
		//this.socket.request('dashboard/deleteConcept', this.concepts[index].title);
	}

	removeConcept(index: number): void {
		this.socket.request('dashboard/deleteConcept', this.concepts[index].title);
	}

	/*****************************************************************************
	 *  SEARCH SUBJECTS
	 ****************************************************************************/
	searchConcepts(): void {
		this.socket.request('dashboard/searchConcepts', {
			title: this.searchTitle,
			sort: this.searchSort,
		});
	}

	searchContributors(): void {}
}
