import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router"
import * as io from 'socket.io-client';

import { Subject } from '../models/subject.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  /*****************************************************************************
   *  VARIABLES
   ****************************************************************************/
  private sub: Subscription;
  private apiURL = environment.api + '/subject';
  private socket: SocketIOClient.Socket = io(this.apiURL);

  public subjects: Subject[] = [] as Subject[];

  /*****************************************************************************
   *  MAIN
   ****************************************************************************/
  constructor(
    private activeRouter: ActivatedRoute
  ) { 

    console.log("Subject Service");

    // Get Dashboard Subjects
    this.sub = this.dashboardSubjectsResponse().subscribe(subjects => {
      console.log(subjects);
      this.subjects = Subject.maps(subjects);
    });
  }

  /*****************************************************************************
   *  WEB SOCKETS RESPONSE
   ****************************************************************************/
  public dashboardSubjectsResponse = () => {
    return Observable.create((observer) => {
        this.socket.on('subjects-response', (message) => {
            observer.next(message);
        });
    });
  }


  public getAllSubjectsResponse = () => {
    return Observable.create((observer) => {
        this.socket.on('get-all-response', (message) => {
            observer.next(message);
        });
    });
  }

  public get = () => {
    return Observable.create((observer) => {
        this.socket.on('get', (message) => {
            observer.next(message);
        });
    });
  }

  public update = () => {
    return Observable.create((observer) => {
        this.socket.on('update', (message) => {
            observer.next(message);
        });
    });
  }

  public subjectCreated = () => {
    return Observable.create((observer) => {
        this.socket.on('new-subject-response', (message) => {
            observer.next(message);
        });
    });
  }

   /*****************************************************************************
   *  WEB SOCKETS REQUEST
   ****************************************************************************/

   public getDashboardSubjects() {
    this.socket.emit('get-all');
   }

  createNewSubject(title: string) {
    this.socket.emit('create-new-subject', title);
  }

  public getAll() {
    this.socket.emit('get-all');
  }

  public getSubject(id: number) {
    this.socket.emit('get subject by id', id);
  }

  public create(subject: Subject) {
    console.log(subject);
    this.socket.emit('create', subject);
  }

  public delete(subject: Subject) {
    this.socket.emit('delete', subject);
  }

  public save(subject: Subject) {
    this.socket.emit('save', subject);
  }

}

