import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription  } from 'rxjs';

import { SubjectService } from "../../services/subject.service";
import { Subject } from '../../models/subject.model';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';
import { SocketService } from 'src/app/services/socket.service';

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

  // Search
  searchTitle: String = "";
  sortOptions: String[] = ["A - Z", "Z - A", "Oldest", "Newest", "Most Contributors", "Least Contributors", "Most Texts", "Least Texts"];
  searchSort: String = "none";
  searchContributor: String = "";

  // Create subject
  createSubjectTitle: string = "";
  createSubjectError: string = "";
  createSubjectInvalid: boolean = false;
  /*
  subjectCreated: boolean = true;
  subjectCreatedMessage: string = "";
  */

  contributorUsername: string = "";

  /*****************************************************************************
   *  MAIN
   ****************************************************************************/
  constructor(
    private router: Router,
    private ss: SubjectService,
    private us: UserService,
    private socket: SocketService
  ) { 

    // Subject Error Message
    this.sub = this.socket.response('subject/create-error').subscribe(message => {
      if(message == null) {
        this.createSubjectTitle = '';
        this.createSubjectError = '';
        this.createSubjectInvalid = false;
        $('#createSubject').modal('hide');
      } else {
        this.createSubjectError = message;
        this.createSubjectInvalid = true;
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
    this.socket.request('subject/search', {
      title: this.searchTitle,
      sort: this.searchSort
    });
    /*
    this.ss.getDashboardSubjects();
    this.us.getTop5Users(this.contributorUsername);*/
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /*****************************************************************************
   *  CREATE DIALOG
   ****************************************************************************/
   openModal() {
    $('#createSubject').modal('show');
  }

  closeModal() {
    this.createSubjectInvalid = false;
    this.createSubjectTitle = "";
    $('#createSubject').modal('hide'); 
  }

  createNewSubject() {
    console.log(this.createSubjectTitle.replace(/\s\s+/g, ' '));
    console.log(this.createSubjectTitle.match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g));
    this.socket.request('subject/create-by-title', this.createSubjectTitle);
  }

  viewSubject(subject: Subject): void {
    this.router.navigate(['/content', subject.url])
  }

  removeSubject(index: number): void {
    this.socket.request('subject/delete-by-title', this.ss.subjects[index].title);
  }
  
  /*****************************************************************************
   *  SEARCH SUBJECTS
   ****************************************************************************/
  searchSubjects(): void {
    this.socket.request('subject/search', {
      title: this.searchTitle,
      sort: this.searchSort
    });
  }

  getContributors(): void {
    console.log(this.searchContributor);
  }

  searchContributors(): void {
    
  }
}
