import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

  dataModel: string;

  constructor() { }

  ngOnInit() {
    this.dataModel = "just checking";
  }

  display(){
    console.log(this.dataModel);
    this.dataModel += "asd";
  }

  



}
