import { Component, OnInit, OnDestroy, Input, NgZone, ViewChild, ElementRef  } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription, fromEventPattern } from 'rxjs';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ContentService } from '../../../services/content.service';
import { Text } from '../../../models/text.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  /*****************************************************************************
   *  VARIABLES
   ****************************************************************************/
  public description: string;
  public Editor = ClassicEditor;

  /*****************************************************************************
   *  MAIN
   ****************************************************************************/
  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private _ngZone: NgZone,
    private cs: ContentService,
    private elementRef:ElementRef
  ) {
  }

  ngOnInit() { 
  }

  ngOnDestroy() {
  }

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
  private isDragging: boolean = false;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.cs.moveEditorText(event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      this.cs.adoptExplorerText(event.previousIndex, event.currentIndex);
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

  /*****************************************************************************
   *  EDITOR
   ******************************** ********************************************/

  public toggleDetailedEditor(index: number) {
    if(this.cs.editorTexts[index].showDetailed === true)
      this.cs.editorTexts[index].showDetailed = false;
    else
      this.cs.editorTexts[index].showDetailed = true;
  }

  public createText(index: number) {
    this.cs.editorTexts.splice(index + 1, 0, new Text());
  }

  public deleteText(index: number) {
    this.cs.editorTexts.splice(index, 1);
  }

  //public isDisabled: boolean = true;

  // remove dom
   public onMouseOver(index: number, value: boolean) {
    //this.mockTexts[index].showDetailed = value;




     /*
     this.mockTexts[index].showDetailed = value;
     if(value === true)
      this.mockTexts[index].ckConfig = null;
    else
      this.mockTexts[index].ckConfig = {toolbar: false};

    console.log(this.mockTexts[index].ckConfig + "");
    */
   }
}
