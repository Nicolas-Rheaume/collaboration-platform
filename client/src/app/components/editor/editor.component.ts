import { Component, OnInit, OnDestroy, Input, NgZone, ViewChild, ElementRef, NgModule, ViewChildren, QueryList } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, fromEventPattern } from 'rxjs';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

import { ChangeEvent, BlurEvent, FocusEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import { ContentService } from '../../services/content.service';
import { Text } from '../../models/text.model';

//import { MultirootEditor, MultirootEditorUI, MultirootEditorUIView} from '../../ckeditor/multi-root-editor';
import { EditableComponent } from './editable/editable.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ContenteditableDirective } from './editable/editable.directive';

//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { SocketService } from 'src/app/services/socket.service';
import { Document } from 'src/app/models/document.model';
//import * as MultirootEditor from '../../../tools/ckeditor/MultiRootEditor/multirooteditor';

// Multirooteditor
//import { MultiRootEditor } from '../../../tools/ckeditor/multirooteditor';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	Editor = DecoupledEditor;
	isDisabled = false;
	configData = { toolbar: false };
	@ViewChildren('editable') editables: QueryList<any>;

	/*
  public editorConfiguration = {
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload', 'blockQuote',
      'insertTable', 'mediaEmbed', 'undo', 'redo' ],
    image: {
      toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],
      styles: [ 'full', 'alignLeft', 'alignRight' ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    placeholder: {
      header: 'Header text goes here',
      content: 'Type content here',
      footerleft: 'Left footer content',
      footerright: 'Right footer content'
    }
  };
  */

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/

	// Variables
	corpusTitle: string = '';
	document: Document = new Document();
	activeText: number = 0;

	// Constructor
	constructor(public socket: SocketService, public activeRouter: ActivatedRoute, public router: Router, public _ngZone: NgZone, public cs: ContentService, public elementRef: ElementRef) {
		// Set the corpus to the client
		this.sub = this.activeRouter.params.subscribe(async params => {
			this.corpusTitle = params.title;
			await this.socketResponse();
		});
	}

	ngOnInit() {}

	ngOnDestroy() {
		console.log('Editor Destroy');
	}

	/*****************************************************************************
	 *  SOCKET
	 ****************************************************************************/

	// Variables
	sub: Subscription;

	// Socket Response
	private async socketResponse(): Promise<void> {
		// Editor Error Message
		this.sub = this.socket.response('editor/error').subscribe(response => {
			if (response.success === false) console.log(response.message);
		});

		// Editor Document
		this.sub = this.socket.response('editor/document').subscribe((document: Document) => {
			this.document = document;
		});

		// Initialize the Document
		this.socket.request('editor/initialize', this.corpusTitle);
	}

	/*****************************************************************************
	 *  EDITOR
	 ****************************************************************************/

	/*****************************************************************************
	 *  EDITABLE EVENTS
	 ****************************************************************************/

	// Variables

	private onReady(editor) {
		document.getElementById('toolbar').appendChild(editor.ui.view.toolbar.element);
	}

	private onActivateText(index: number) {
		this.activeText = index;
	}

	private onUpdate(event) {
		const index: number = this.activeText;
		const text: string = this.document.texts[this.activeText].text;
		this.socket.request('editor/updateTextAtIndex', [index, text]);
	}

	// Split Event when a new line is entered
	private onSplit(event) {
		this.document.texts[event.index].text = event.first;
		const text = new Text(event.second);
		this.document.texts.splice(event.index + 1, 0, text);
		this.activeText++;
		setTimeout(() => {
			this.editables.last.elementRef.editorElement.focus();
		}, 0);
		this.socket.request('editor/splitTextAtIndex', [event.index, event.first, event.second]);
	}

	// Merge Event when a paragraphs is empty
	private onMerge(event) {
		if (this.document.texts.length > 0) {
			let promise = new Promise((resolve, reject) => {
				this.editables.last.elementRef.editorElement.blur();
				this.activeText--;
				this.document.texts.splice(event.index, 1);
				resolve();
			}).then(() => {
				setTimeout(() => {
					this.editables.first.elementRef.editorElement.focus();
					document.getSelection().collapse(this.editables.first.elementRef.editorElement, 1);
				}, 0);
				this.socket.request('editor/mergeTextAtIndex', [event.index]);
			});
		}
	}

	setCaretPosition(target, pos) {
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(target, 0);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}

	trackText(index: number, element: any) {
		return element ? element.guid : null;
	}

	/*****************************************************************************
	 *  DRAGGABLE EVENTS
	 ****************************************************************************/
	private isDragging: boolean = false;

	onMouseOver(index: number, value: boolean) {}

	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			this.activeText = event.currentIndex;
			this.socket.request('editor/moveTextAtIndex', [event.previousIndex, event.currentIndex]);
		} else {
			transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
			this.socket.request('editor/adoptTextAtIndex', [event.previousIndex, event.currentIndex]);
		}
	}

	entered(event: CdkDragEnter<string[]>) {
		//console.log('Entered', event.item.data);
	}
	exited(event: CdkDragExit<string[]>) {
		//console.log('Exited', event.item.data);
	}
	started(event: CdkDragStart<string[]>) {
		//console.log('Started', event);
	}
	ended(event: CdkDragExit<string[]>) {
		//console.log('Started', event);
	}

	// private onSplit(event) {
	// 	console.log(event);

	// 	this.document.splice(event.index + 1, 0, event.second);
	// 	this.shows.splice(event.index + 1, 0, true);

	// 	setTimeout(() => {
	// 		this.shows[event.index] = false;
	// 		this.editables.last.elementRef.editorElement.focus();

	// 		//console.log(this.editables.last.elementRef.editorElement.focus());

	// 		console.log('Asd');
	// 	}, 0);

	// 	/*
	// this.document[event.index] = event.text;
	// this.document.splice(event.index + 1, 0, "<p></p>");
	// this.shows.splice(event.index + 1, 0, true);
	// this.shows[event.index] = false;
	// /*
	// let text = event.text.split("</p><p>");
	// this.document[event.index] = text[0] + "</p>";
	// this.document.splice(event.index + 1, 0, text[1].replace("&nbsp;", "<p>"));
	// */

	// 	/*
	// console.log(event);
	// this.shows[event.index] = false;
	// this.document[event.index] = event.text;

	// setTimeout(() => {
	//   this.document[event.index] = event.text;
	//   this.shows[event.index] = false;
	// }, 0);

	// /*
	// this.document[event.index] = event.text;
	// this.document.splice(event.index + 1, 0, text[1].replace("&nbsp;", "<p>"));

	// this.shows.splice(event.index + 1, 0, true);

	// setTimeout(() => {
	//   //elements[1].focus();
	//   this.shows[event.index] = false;
	// }, 0);
	// */

	// 	//console.log(this.editables[0]);

	// 	/*
	// let elements = document.getElementsByClassName("ck-editor__editable"): HTMLElement;
	// console.log(elements);
	// setTimeout(() => {
	//   //elements[1].focus();
	//   console.log(elements[1]);
	// }, 0);
	// */
	// 	console.log(this.document);
	// }

	// setCaretPosition(target, pos) {
	// 	var range = document.createRange();
	// 	var sel = window.getSelection();
	// 	range.setStart(target, 0);
	// 	range.collapse(true);
	// 	sel.removeAllRanges();
	// 	sel.addRange(range);
	// }

	// destroyEditable() {
	// 	return new Promise((resolve, reject) => {}).then;
	// }

	// trackText(index: number, element: any) {
	// 	return element ? element.guid : null;
	// }

	/*****************************************************************************
	 *  OLD STUFF
	 ****************************************************************************/

	texts: string[] = ['<p>Hello, world!</p>', '<p>This is a test</p>', '<p>This is a test2</p>'];
	shows: boolean[] = [true, false, false];
	switch: number = 0;

	/*
  ngOnInit() { 

    //console.log(this.Editor);


    this.Editor
			.create( {
				header: document.querySelector( '#header' ),
				content: document.querySelector( '#content' ),
				footerleft: document.querySelector( '#footer-left' ),
				footerright: document.querySelector( '#footer-right' )
			}, {
				toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload', 'blockQuote',
					'insertTable', 'mediaEmbed', 'undo', 'redo' ],
				image: {
					toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],
					styles: [ 'full', 'alignLeft', 'alignRight' ]
				},
				table: {
					contentToolbar: [
						'tableColumn',
						'tableRow',
						'mergeTableCells'
					]
				},
				placeholder: {
					header: 'Header text goes here',
					content: 'Type content here',
					footerleft: 'Left footer content',
					footerright: 'Right footer content'
				},
			} )
			.then( newEditor => {
				document.querySelector( '#toolbar' ).appendChild( newEditor.ui.view.toolbar.element );

				//window.editor = newEditor;
			} )
			.catch( err => {
				console.error( err.stack );
      } );
      */

	/*
    console.log(document.querySelector( '#header' ));

    this.Editor.create( {
        header: document.querySelector( '#header' ),
        content: document.querySelector( '#content' ),
        footerleft: document.querySelector( '#footer-left' ),
        footerright: document.querySelector( '#footer-right' )
      }, {
        toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload', 'blockQuote',
          'insertTable', 'mediaEmbed', 'undo', 'redo' ],
        image: {
          toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],
          styles: [ 'full', 'alignLeft', 'alignRight' ]
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
          ]
        },
        placeholder: {
          header: 'Header text goes here',
          content: 'Type content here',
          footerleft: 'Left footer content',
          footerright: 'Right footer content'
        }
      } )
      .then( newEditor => {
        document.querySelector( '#toolbar' ).appendChild( newEditor.ui.view.toolbar.element );
    
        //window.editor = newEditor;
      } )
      .catch( err => {
        console.error( err.stack );
      } );
      
  }
  */

	/*
  onUpdate(event) {
    console.log(event);
    console.log(this.document);
    console.log(this.text)

    //this.editorData[index] = event.text;

    //this.setCaretPosition(document.getElementsByClassName('editable')[index], event.caret, event.caret);
  } 
  */

	onClick() {
		//this.editorData[0] = "asdasdasdasd";
	}

	onFocus() {
		console.log('on focus');
	}

	onBlur() {
		console.log('on blur');
	}

	/*
  setCaretPosition(element, start, end) {


    if (window.getSelection) {
      let sel = window.getSelection();
      sel.collapse(element, 0);
    }
    return null;

    //element.nativeElement.setSelectionRange(start, end, 'none');

    element.nativeElement.selectionStart = start;
    element.nativeElement.selectionEnd = end;

    //console.log(element.nativeElement);
}
*/

	/*
  public setCaretPosition(index: number) {
    // for contentedit field
    if (this.isContentEditable) {
      this.target.focus()
      document.getSelection().collapse(this.target, pos)
      return
  }
  this.target.setSelectionRange(pos, pos)
  }
  */

	// MULTIROOTEDITOR

	/*

  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
}

  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    console.log( data );
  }

  public onBlur( { editor }: BlurEvent ) {
    const data = editor.getData();
    console.log( "on blur" );
  }

  public onFocus( { editor }: FocusEvent ) {
    const data = editor.getData();
    console.log( "on focus" );
  }


  toggleDisabled() {
    this.isDisabled = !this.isDisabled

    if(this.isDisabled) this.configData = {toolbar: false};
    else this.configData = {toolbar: true};

    console.log(this.configData);
  }

  print() {
    this.editorData = ['<p>Hello, world! asdasdasd</p>', '<p>This is a test</p>', '<p>This is a test 2</p>'];
    console.log(this.editorData);
  }
  */

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/

	public save(): void {
		//this.cs.saveEditorText();
	}

	update() {
		console.log(this.cs.editorTexts);
	}

	/*****************************************************************************
	 *  DRAGGABLE
	 ****************************************************************************/
	// private isDragging: boolean = false;

	// drop(event: CdkDragDrop<string[]>) {
	// 	if (event.previousContainer === event.container) {
	// 		moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
	// 		this.cs.moveEditorText(event.previousIndex, event.currentIndex);
	// 	} else {
	// 		transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
	// 		this.cs.adoptExplorerText(event.previousIndex, event.currentIndex);
	// 	}
	// }

	// entered(event: CdkDragEnter<string[]>) {
	// 	//console.log('Entered', event.item.data);
	// }
	// exited(event: CdkDragExit<string[]>) {
	// 	//console.log('Exited', event.item.data);
	// }
	// started(event: CdkDragStart<string[]>) {
	// 	//console.log('Started', event);
	// }
	// ended(event: CdkDragExit<string[]>) {
	// 	//console.log('Started', event);
	// }

	/*****************************************************************************
	 *  EDITOR
	 ******************************** ********************************************/

	public toggleDetailedEditor(index: number) {
		//if (this.cs.editorTexts[index].show === true) this.cs.editorTexts[index].show = false;
		//else this.cs.editorTexts[index].show = true;
	}

	public createText(index: number) {
		this.cs.editorTexts.splice(index + 1, 0, new Text());
	}

	public deleteText(index: number) {
		this.cs.editorTexts.splice(index, 1);
	}

	//public isDisabled: boolean = true;

	// remove dom
	// public onMouseOver(index: number, value: boolean) {
	// 	//this.mockTexts[index].showDetailed = value;
	// 	/*
	//  this.mockTexts[index].showDetailed = value;
	//  if(value === true)
	//   this.mockTexts[index].ckConfig = null;
	// else
	//   this.mockTexts[index].ckConfig = {toolbar: false};

	// console.log(this.mockTexts[index].ckConfig + "");
	// */
	// }
}

/*****************************************************************************
 *  EDITOR
 ******************************** ********************************************/

/*
MultirootEditor
    .create( {
        header: document.querySelector( '#header' ),
        content: document.querySelector( '#content' ),
        footerleft: document.querySelector( '#footer-left' ),
        footerright: document.querySelector( '#footer-right' )
    }, {
        toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload', 'blockQuote',
            'insertTable', 'mediaEmbed', 'undo', 'redo' ],
        image: {
            toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],
            styles: [ 'full', 'alignLeft', 'alignRight' ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
        placeholder: {
            header: 'Header text goes here',
            content: 'Type content here',
            footerleft: 'Left footer content',
            footerright: 'Right footer content'
        },
    } )
    .then( newEditor => {
        document.querySelector( '#toolbar' ).appendChild( newEditor.ui.view.toolbar.element );

        this.Editor = newEditor;
    } )
    .catch( err => {
        console.error( err.stack );
    } );
    */
