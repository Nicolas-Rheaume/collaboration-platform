import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tableofcontent',
  templateUrl: './tableofcontent.component.html',
  styleUrls: ['./tableofcontent.component.scss']
})
export class TableofcontentComponent implements OnInit {

  constructor() {
    console.log("Table of Content loaded");
   }

  ngOnInit() {
  }
}
