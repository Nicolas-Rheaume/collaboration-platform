import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

//import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

import { User } from '../models/user.model';
import { Corpus } from '../models/corpus.model';
import { Text } from '../models/text.model';
import { SocketService } from './socket.service';

import * as arrayMove from 'array-move';
import { FormControl } from '@angular/forms';
import { Document } from '../models/document.model';
import { Concept } from '../models/concept.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { ContentCreateDocumentComponent } from '../pages/content/leftnav/create-document/create-document.component';
import { MatDialog } from '@angular/material';

import * as jsdiff from 'diff';

@Injectable({
	providedIn: 'root',
})
export class ContentService {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private sub: Subscription;
	private corpusTitle: string = '';

	// To Change to :
	public conceptTitle: string = '';
	public editingDocumentIndex: number = 0;
	public editorCorpus: Corpus = null;
	public editorPanelOpenStates: boolean[] = [];

	public exploringCorpusIndex: number = 0;
	public exploringDocumentIndex: number = 0;
	public explorerConcept: Concept = null;
	public explorerCorporaPanelOpenStates: boolean[] = [];

	public editorTexts: Text[] = [];

	// TO DELETE

	private user: User = new User();

	public corpus: Corpus = new Corpus();
	public explorerTexts: Text[] = [];
	public editorCommands: boolean = false;

	public useMockData: boolean = false;

	public editorDocument: Document = new Document();

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(private socket: SocketService, private us: UserService, private dialog: MatDialog) {
		// Editor Error Message
		this.sub = this.socket.response('editor/error').subscribe(response => {
			if (response.success === false) console.log(response.message);
		});

		// Editor Corpus
		this.sub = this.socket.response('editor/corpus').subscribe(async (editorCorpus: Corpus) => {
			this.editorCorpus = Corpus.map(editorCorpus);
			this.editorPanelOpenStates = new Array<boolean>(this.editorCorpus.documents.length).fill(false);
			console.log(this.editorCorpus);
		});

		// Editor Document
		this.sub = this.socket.response('editor/document').subscribe(([index, document]) => {
			console.log(document);
			this.editorCorpus.documents[index] = Document.map(document);
			console.log(this.editorCorpus.documents[index]);
			this.selectedEditorState.setValue(1);
		});

		// Explorer Concept
		this.sub = this.socket.response('explorer/concept').subscribe(explorerConcept => {
			this.explorerConcept = Concept.map(explorerConcept);
			this.explorerCorporaPanelOpenStates = new Array<boolean>(this.explorerConcept.corpora.length).fill(false);
			console.log(this.explorerConcept);
		});

		// Explorer Concept
		this.sub = this.socket.response('explorer/error').subscribe(msg => {
			console.log(msg);
		});

		// Explorer Document
		this.sub = this.socket.response('explorer/document').subscribe(([corpusIndex, documentIndex, document]) => {
			console.log(document);
			this.explorerConcept.corpora[corpusIndex].documents[documentIndex] = Document.map(document);
		});
	}

	/*****************************************************************************
	 *  DISPLAY SETTINGS
	 ****************************************************************************/
	// Variables
	public selectedDisplayState: FormControl = new FormControl(0);
	public displayStates = [
		{ value: 0, name: 'Editor' },
		{ value: 1, name: 'Explorer' },
		{ value: 2, name: 'Split vertical' },
		{ value: 3, name: 'Split horizontal' },
	];

	public setDisplayState(state) {
		this.selectedDisplayState.setValue(state.value);
	}

	/*****************************************************************************
	 *  DOCUMENT METHODS
	 ****************************************************************************/
	// Variables

	openCreateDocumentDialog() {
		this.dialog.open(ContentCreateDocumentComponent, {
			data: {
				index: -1,
				title: '',
				description: '',
			},
			width: '40%'
		});
	}

	editCreateDocumentDialog(index: number) {
		this.editorPanelOpenStates[index] = false;
		console.log(this.editorPanelOpenStates);
		this.dialog.open(ContentCreateDocumentComponent, {
			data: {
				index: index,
				title: this.editorCorpus.documents[index].title,
				description: this.editorCorpus.documents[index].description,
			},
			width: '40%'
		});
	}

	createNewDocument() {

	}
	
	public createCorpus() {
		this.socket.request('editor/createCorpus', null);
	}

	// to do
	public adoptCorpus() {
		this.socket.request('editor/createCorpus', null);
	}

	/*****************************************************************************
	 *  EDITOR SETTINGS
	 ****************************************************************************/
	// Variables
	public selectedEditorState: FormControl = new FormControl(0);
	public editorState = [
		{ value: 0, name: 'Overview', icon: 'home' },
		{ value: 1, name: 'Edit', icon: 'edit' },
		{ value: 2, name: 'History', icon: 'menu_book' },
	];

	public setEditorState(state) {
		this.selectedEditorState.setValue(state.value);
	}

	public changeEditor(state: number, index: number) {
		if(this.selectedEditorState.value === 1) {
			this.socket.request('editor/saveDocumentAtIndex', [this.editingDocumentIndex]);
		}
		this.selectedEditorState.setValue(state);
		this.editingDocumentIndex = index;
		if(state == 1) {
			this.socket.request('editor/getDocument', index);
		}

		if(this.selectedExplorerMode.value == 1) {
			this.selectCompareUser();
		}

		if(this.selectedEditorState.value == 1 && this.selectedExplorerState.value == 2) {
			this.calculateTextDiff();
		}
	}

	public initializeEditor(title: string): void {
		if (title != this.corpusTitle) {
			this.corpusTitle = title;
			this.socket.request('editor/initialize', title);
		}
	}

	public deleteDocumentAtIndex(index: number): void {
		this.socket.request('editor/deleteDocumentAtIndex', index);
	}

	/*****************************************************************************
	 *  EXPLORER SETTINGS
	 ****************************************************************************/
	// Variables
	public selectedExplorerState: FormControl = new FormControl(0);
	public explorerState = [
		{ value: 0, name: 'Overview', icon: 'home' },
		{ value: 1, name: 'Corpus', icon: 'home' },
		{ value: 2, name: 'Edit', icon: 'edit' },
		{ value: 3, name: 'Recommended', icon: 'home' },
	];

	public setExplorerState(state) {
		this.selectedExplorerState.setValue(state.value);
	}

	public initializeExplorer(title: string): void {
		this.corpusTitle = title;
		this.socket.request('explorer/initialize', title);
		// if (title != this.corpusTitle) {
		// 	this.corpusTitle = title;
		// 	this.socket.request('explorer/initialize', title);
		// }
	}

	public changeExplorer(state: number, index: number) {
		this.selectedExplorerState.setValue(state);
		if (state === 1) {
			this.exploringCorpusIndex = index;
		} else if(state === 2) {
			this.exploringDocumentIndex = index;
			this.socket.request('explorer/getDocument', [this.exploringCorpusIndex, this.exploringDocumentIndex]);
		}

		if(this.selectedEditorState.value == 1 && this.selectedExplorerState.value == 2) {
			this.calculateTextDiff();
		}
	}

	/*****************************************************************************
	 *  EXPLORER MODE
	 ****************************************************************************/
	// Variables
	public selectedExplorerMode: FormControl = new FormControl(0);
	public explorerMode = [
		{ value: 0, name: 'None', icon: 'home' },
		{ value: 1, name: 'Side by Side', icon: 'home' },
		{ value: 2, name: 'Recommended', icon: 'edit' },
	];

	public setExplorerMode(mode) {
		this.selectedExplorerMode.setValue(mode.value);
	}

	/*****************************************************************************
	 *  EXPLORER MODE - Compare User
	 ****************************************************************************/
	public compareModeUserID: number = -1;

	public onClickCompareUser(userID: number) {
		this.compareModeUserID = userID;
		this.selectedExplorerMode.setValue(1);
		this.selectCompareUser();
	}

	public selectCompareUser() {
		if(this.selectedEditorState.value == 0)
			this.changeExplorer(1, this.compareModeUserID);
		else if(this.selectedEditorState.value == 1) {
			this.exploringCorpusIndex = this.compareModeUserID;
			for(let i = 0; i < this.explorerConcept.corpora[this.compareModeUserID].documents.length; i++) {
				if(this.explorerConcept.corpora[this.compareModeUserID].documents[i].title === this.editorCorpus.documents[this.editingDocumentIndex].title) {
					this.changeExplorer(2, i);
					break;
				}
			}
		}
	}

	/*****************************************************************************
	 *  DRAG AND DROP
	 ****************************************************************************/

	public editorDocumentDrop(event: CdkDragDrop<any>) {
		if(event.container.data[0] instanceof Document && event.previousContainer.data[0] instanceof Document) {
			if (event.previousContainer === event.container) {
				moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
				this.socket.request('editor/moveDocumentAtIndex', [ event.previousIndex, event.currentIndex ]);
			} else {
				this.editorCorpus.documents.splice(event.currentIndex, 0, this.explorerConcept.corpora[this.exploringCorpusIndex].documents[event.previousIndex]);
				this.editorPanelOpenStates.splice(event.currentIndex, 0, false);
				this.socket.request('editor/adoptDocumentAtIndex', [ event.previousIndex, event.currentIndex, this.exploringCorpusIndex ]);
				//transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
			}
		}
	}

	public editorTextDrop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			this.socket.request('editor/moveTextAtIndex', [event.previousIndex, event.currentIndex]);
		} else {
			this.editorCorpus.documents[this.editingDocumentIndex].texts.splice(
				event.currentIndex, 
				0, 
				this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[event.previousIndex].getCopy()
			);
			//transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
			this.socket.request('editor/adoptTextAtIndex', [event.previousIndex, event.currentIndex]);
		}



		// if (event.previousContainer === event.container) {
		// 	moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		// } else {
		// 	transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
		// }
	}

	public explorerDocumentDrop(event: CdkDragDrop<string[]>) {
	}

	public explorerTextDrop(event: CdkDragDrop<string[]>) {
	}

	/*****************************************************************************
	 *  TEXT DIFF
	 ****************************************************************************/
	public showTextDiff: boolean = false;
	public showTextDiffLabel: string = 'Show Text Difference'

	public clickTextDiff() {
		if(!this.showTextDiff) {
			this.socket.request('explorer/getDocumentDiff', [this.editingDocumentIndex, this.exploringCorpusIndex, this.exploringDocumentIndex]);
		} else {
			this.socket.request('explorer/getDocument', [this.exploringCorpusIndex, this.exploringDocumentIndex]);
		}
	}

	public clickAddText(from: number) {
		this.selectedEditorState.setValue(0);
		const to = this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[from].refIndex;
		this.socket.request('explorer/addDiffText', [from, to]);
	}	

	public clickRemoveText(from: number) {
		this.selectedEditorState.setValue(0);
		const to = this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[from].refIndex;
		this.socket.request('explorer/removeDiffText', [from, to]);
	}

	public clickUpdateText(from: number) {
		this.selectedEditorState.setValue(0);
		const to = this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[from].refIndex;
		this.socket.request('explorer/updateDiffText', [from, to]);
	}

	public calculateTextDiff() {
		for(let i = 0; i < this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts.length; i++) {

			// Using the diff library to compare the two texts
			let diff = jsdiff.diffWords(
				this.editorCorpus.documents[this.editingDocumentIndex].texts[i].text,
				this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[i].text
			);

			// Color code the diff text
			this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[i].text = '';
			for(let k = 0; k < diff.length; k++) {
				if (diff[k].added === true) 
					this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[i].text += "<span class='text-success'>" + diff[k].value + "</span>";
				else if (diff[k].removed === true) 
					this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[i].text += "<span class='text-danger'>" + diff[k].value + "</span>";
				else 
					this.explorerConcept.corpora[this.exploringCorpusIndex].documents[this.exploringDocumentIndex].texts[i].text += "<span>" + diff[k].value + "</span>";
			}


		}
	 }

	/*****************************************************************************
	 *  RECOMMENDED
	 ****************************************************************************/

	

	/*****************************************************************************
	 *  WEB SOCKETS REQUEST
	 ****************************************************************************/

	public createTextAtIndex(index: number) {
		this.socket.request('editor/create-text-at-index', index);
	}

	public deleteTextAtIndex(index: number) {
		console.log(index);
		console.log(this.editorTexts);
		this.socket.request('editor/delete-text-at-index', index);
	}

	public saveEditorTexts() {
		this.socket.request(
			'editor/update-texts',
			this.editorTexts.map(text => {
				return text.text;
			}),
		);
	}

	public refreshEditorTexts() {
		this.socket.request('editor/refresh-texts', {});
	}

	public moveEditorText(from: number, to: number) {
		if (from === to) return;
		else this.socket.request('editor/move-text', { from, to });
	}

	public moveExplorerText(from: number, to: number) {
		if (from === to) return;
		else this.socket.request('explorer/move-text', { from, to });
	}

	public adoptExplorerText(from: number, to: number) {
		this.socket.request('explorer/adopt-text', { from, to });
	}

	public increasePointer(index: number, amount: number) {
		this.socket.request('editor/increase-pointer', { index, amount });
	}

	public hideCommands() {
		if (this.editorCommands === true) this.editorCommands = false;
		else this.editorCommands = true;
	}
}
