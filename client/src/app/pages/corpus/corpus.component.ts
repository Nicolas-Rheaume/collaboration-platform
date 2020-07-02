import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-corpus',
  templateUrl: './corpus.component.html',
  styleUrls: ['./corpus.component.scss']
})
export class CorpusComponent implements OnInit {

  public name: string = "test";
  public count: number = 0;
  public check: boolean = false;

  constructor() { }

  ngOnInit() {
  }



}
