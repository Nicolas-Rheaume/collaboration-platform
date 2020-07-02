import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
	selector: 'app-viewer',
	templateUrl: './viewer.component.html',
	styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {

	constructor() {
  }

	ngOnInit() {}

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
}
