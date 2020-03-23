import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit, OnDestroy  {

  /*****************************************************************************
   *  VARIABLES
   ****************************************************************************/
  public description: string;

  done: string[] = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  /*****************************************************************************
   *  MAIN
   ****************************************************************************/
  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private cs: ContentService,
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

  }

  /*****************************************************************************
   *  DRAGGABLE
   ****************************************************************************/


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
