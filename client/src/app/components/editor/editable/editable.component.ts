import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ElementRef, SimpleChanges, HostListener, Sanitizer, SecurityContext, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';

import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent, BlurEvent, FocusEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
	selector: 'editable',
	templateUrl: './editable.component.html',
	styleUrls: ['./editable.component.scss'],
})
export class EditableComponent implements OnInit, OnDestroy {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private toolbar;
	private Editor = DecoupledEditor;

	@ViewChild('editable', { static: false }) elementRef;
	@Input() index: number;
	@Input() text: string;
	@Output() textChange = new EventEmitter();
	@Output() blur = new EventEmitter();
	@Output() update = new EventEmitter();
	@Output() merge = new EventEmitter();
	@Output() split = new EventEmitter();

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {
		this.toolbar.remove();
	}

	/*****************************************************************************
	 *  EDITOR EVENTS
	 ****************************************************************************/
	private onReady(editor) {
		this.toolbar = editor.ui.view.toolbar.element;
		document.getElementById('toolbar').appendChild(editor.ui.view.toolbar.element);
	}

	private onChange(event) {
		this.textChange.emit(this.text);
		this.update.emit();

		// Split text if there's a new paragraph
		if (this.text.includes('</p><p>')) {
			let text = this.text.split('</p><p>');
			let first = text[0] + '</p>';
			let second = '<p>' + text[1];

			setTimeout(() => {
				console.log(this.elementRef);
				this.elementRef.editorElement.blur();
				this.text = first;

				console.log(this.text);
				this.split.emit({ index: this.index, first: first, second: second });
			}, 0);
		}

		// Merge text if the user backspace when there's no text
		if (this.text === null || this.text === '') {
			if (this.index > 0) this.merge.emit({ index: this.index });
		}
	}

	private getCaretPosition() {
		if (window.getSelection) {
			let sel = window.getSelection();
			if (sel.getRangeAt) {
				return sel.getRangeAt(0).startOffset;
			}
		}
		return null;
	}

	private setCaretPosition() {
		setTimeout(() => {
			let sel = window.getSelection();

			console.log(document.getElementsByClassName('editable')[this.index].firstChild.firstChild);

			sel.collapse(document.getElementsByClassName('editable')[this.index].firstChild.firstChild, this.position);
		}, 1);
	}

	/*****************************************************************************
	 *  OLD STUFF
	 ****************************************************************************/
	private selection: Selection;
	private position = 3;
	private element;

	/*
  @Input() disabled: boolean = false;
  @Input() text: string;
  @Input() textHtml: boolean = true;
  @Output() textChange? = new EventEmitter();
  */

	/*
  public onChange(target, text: string, html: string, content: string) {
    this.position = this.getCaretPosition();
    this.textChange.emit({caret: this.position, text: this.text});
    this.setCaretPosition();
  }
  */

	/*
  onChange(event) {
    this.change.emit({index: this.index, text: this.text});
    //this.editorData[index] = event.text;

    //this.setCaretPosition(document.getElementsByClassName('editable')[index], event.caret, event.caret);
  } 

  onUpdate(index, text) {

    console.log("Asd");
    this.update.emit({index: this.index, text: this.text});

    console.log(index)
    console.log(text);
    this.editorData[index] = text;

  }
  */

	onClick() {
		/*
    this.editorData[0] = "asdasdasdasd";
    */
	}

	onFocus() {
		//this.toolbar.style.display = "none";
	}

	onBlur() {
		this.blur.emit();
		//this.toolbar.style.display = "inline";
	}

	/*
  // Study this shit to figure out how it works
  public getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }
  
  public getCaretPosition() {
    if (window.getSelection && window.getSelection().getRangeAt) {
      var range = window.getSelection().getRangeAt(0);
      var selectedObj = window.getSelection();
      var rangeCount = 0;
      var childNodes = selectedObj.anchorNode.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == selectedObj.anchorNode) {
          break;
        }
        if (childNodes[i].outerHTML)
          rangeCount += childNodes[i].outerHTML.length;
        else if (childNodes[i].nodeType == 3) {
          rangeCount += childNodes[i].textContent.length;
        }
      }
      return range.startOffset + rangeCount;
    }
    return -1;
  }
  */

	/*
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['text']) {
      // On init: if text is empty, read from DOM in case the element has content
      if (changes['text'].isFirstChange() && !this.text) {
        this.onInput(true);
      }
      this.refreshView();
    }
  }

  @HostListener('input') // input event would be sufficient, but isn't supported by IE
  @HostListener('blur')  // additional fallback
  @HostListener('keyup') onInput(trim = false) {
    let value = this.elRef.nativeElement[this.getProperty()];
    if (trim) {
      value = value.replace(/^[\n\s]+/, '');
      value = value.replace(/[\n\s]+$/, '');
    }
    this.textChange.emit(value);
  }

  @HostListener('paste') onPaste() {
    this.onInput();
    if (!this.textHtml) {
      // For text-only contenteditable, remove pasted HTML.
      // 1 tick wait is required for DOM update
      setTimeout(() => {
        if (this.elRef.nativeElement.innerHTML !== this.elRef.nativeElement.innerText) {
          this.elRef.nativeElement.innerHTML = this.elRef.nativeElement.innerText;
        }
      });
    }
  }

  private refreshView() {
    const newContent = this.sanitize(this.text);
    // Only refresh if content changed to avoid cursor loss
    // (as ngOnChanges can be triggered an additional time by onInput())
    if (newContent !== this.elRef.nativeElement[this.getProperty()]) {
      this.elRef.nativeElement[this.getProperty()] = newContent;
    }
  }

  private getProperty(): string {
    return this.textHtml ? 'innerHTML' : 'innerText';
  }

  private sanitize(content: string): string {
    return this.textHtml ? this.sanitizer.sanitize(SecurityContext.HTML, content) : content;
  }
  */

	/*
  ngOnInit() {
  }

  public onChange(target, text: string, html: string, content: string) {

    let position = this.getCaretPosition();

    console.log(this.getCaretPosition());
    console.log(text + "\n" + html + "\n" + content);
    this.textChange.emit(html);


    
    //this.setCaretPosition(target, position);


  }

  public getCaretPosition() {
    if (window.getSelection) {
        let sel = window.getSelection();
        if (sel.getRangeAt) {
            return sel.getRangeAt(0).startOffset;
        }
    }
    return null;
  }

  public isChildOf(node, parentId) {
    while (node !== null) {
        if (node.id === parentId) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
};


  public setCaretPosition(target, pos) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(target, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    /*
    var tag = document.getElementById("editable"); 
              
    // Creates range object 
    var setpos = document.createRange(); 
      
    // Creates object for selection 
    var set = window.getSelection(); 
      
    // Set start position of range 
    setpos.setStart(target.childNodes[0], pos); 
      
    // Collapse range within its boundary points 
    // Returns boolean 
    setpos.collapse(true); 
      
    // Remove all ranges set 
    set.removeAllRanges(); 
      
    // Add range with respect to range object. 
    set.addRange(setpos); 
      
    // Set cursor on focus 
    target.focus(); 

    /*
    // document.createRange() creates new range object
    var rangeobj = document.createRange();

    // Here 'rangeobj' is created Range Object
    var selectobj = window.getSelection();

    // Here 'selectobj' is created object for window
    // get selected or caret current position.
    // Setting start position of a Range
    rangeobj.setStart(startNode, startOffset);

    // Setting End position of a Range
    rangeobj.setEnd(endNode, endOffset);

    // Collapses the Range to one of its
    // boundary points
    rangeobj.collapse(true);

    // Removes all ranges from the selection
    // except Anchor Node and Focus Node
    selectobj.removeAllRanges();

    // Adds a Range to a Selection
    selectobj.addRange(rangeobj);


    /*
    // Modern browsers
    if (target.setSelectionRange) {
      target.focus();
      target.setSelectionRange(pos, pos);
    
    // IE8 and below
    } else if (target.createTextRange) {
      var range = target.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }

    /*
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(target, index-1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    target.focus();

    /*
    if (this.isContentEditable) {
      this.target.focus()
      document.getSelection().collapse(this.target, index)
      return
  }
    this.target.setSelectionRange(index, index)
  }
  */

	/*
  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

  public onChange( { editor }: ChangeEvent ) {
    console.log(this.text);

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
  */
}
