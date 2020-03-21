import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription  } from 'rxjs';

import { SubjectService } from "../../services/subject.service";
import { Subject } from '../../models/subject.model';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';

declare var $: any;

@Component({
  selector: 'app-dasboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  /*****************************************************************************
   *  VARIABLES
   ****************************************************************************/
  private sub: Subscription;
  //newSubject: Subject = new Subject();
  subjects: Subject[] = [] as Subject[];
  contributors: User[] = [] as User[];

  newSubjectTitle: string = "";
  subjectCreated: boolean = true;
  subjectCreatedMessage: string = "";

  contributorUsername: string = "";

  /*****************************************************************************
   *  MAIN
   ****************************************************************************/
  constructor(
    private router: Router,
    private ss: SubjectService,
    private us: UserService
  ) { 
    this.sub = this.ss.subjectCreated().subscribe(message => {
      console.log(message);
      if(message.success === true){
        this.ss.getAll();
        this.subjectCreated = true;
        this.newSubjectTitle = "";
        $('#createSubject').modal('hide');
        this.subjectCreatedMessage = "";
      }
      else {
        this.subjectCreatedMessage = message.message;
        this.subjectCreated = false;
      }
    });

    /*
    this.sub = this.ss.getAllSubjectsResponse().subscribe(subjects => {
      console.log(subjects);
      this.subjects = Subject.maps(subjects);
      console.log(this.subjects);
    });


    this.sub = this.ss.update().subscribe(subjects => {
      console.log(subjects);
      this.subjects = Subject.maps(subjects);
      console.log(subjects);
    });

    this.sub = this.us.get().subscribe(users => {
      this.contributors = User.maps(users);
    });
    */
  }

  ngOnInit() {
    this.ss.getDashboardSubjects();
    this.us.getTop5Users(this.contributorUsername);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /*****************************************************************************
   *  DIALOG
   ****************************************************************************/
   openModal() {
    $('#createSubject').modal('show');
  }

  closeModal() {
    this.subjectCreated = true;
    this.newSubjectTitle = "";
    $('#createSubject').modal('hide'); 
  }

  createNewSubject() {
    this.ss.createNewSubject(this.newSubjectTitle);
  }

  viewSubject(subject: Subject): void {
    this.router.navigate(['/content', subject.title])
  }

  removeSubject(index: number): void {
    this.ss.delete(this.subjects[index]);
  }
}
