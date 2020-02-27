import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from 'rxjs';

import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject.model';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  subject: Subject = new Subject();

  dataModel: string;

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private ss: SubjectService
  ) { }

  ngOnInit() {

    this.sub = this.ss.get().subscribe(subject => {
      this.subject = Subject.map(subject);
    });

    this.sub = this.activeRouter.params.subscribe(params => {
      this.ss.getSubject(params.id)
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  update() {
    console.log("asd")
    this.ss.save(this.subject);
  }

  display(){
    console.log(this.dataModel);
    this.dataModel += "asd";
  }

  



}
