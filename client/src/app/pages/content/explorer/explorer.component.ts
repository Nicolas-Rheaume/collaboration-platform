import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'content-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ContentExplorer implements OnInit {

  constructor(
    public cs: ContentService
  ) { 
    
  }

  ngOnInit() {
  }

}
