import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription  } from 'rxjs';

import { SubjectService } from "../../services/subject.service";
import { Subject } from '../../models/subject.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  newSubject: Subject = new Subject();
  subjects: Subject[] = [] as Subject[];

  constructor(
    private ss: SubjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub = this.ss.get().subscribe(subjects => {
      console.log(subjects);
      this.subjects = Subject.maps(subjects);
      console.log(subjects);
    });

    this.sub = this.ss.update().subscribe(subjects => {
      console.log(subjects);
      this.subjects = Subject.maps(subjects);
      console.log(subjects);
    });

    this.ss.getAll();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  viewSubject(subject: Subject): void {
    this.router.navigate(['/subject', subject.id])
  }

  createSubject(): void {
    this.ss.create(this.newSubject);
    this.newSubject = new Subject();
  }

  removeSubject(index: number): void {
    this.ss.delete(this.subjects[index]);
  }
}
