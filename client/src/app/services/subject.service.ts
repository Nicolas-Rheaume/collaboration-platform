import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { Subject } from '../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private socket: SocketIOClient.Socket = io('http://192.168.21.239:3000/subject');

  constructor() { }

  public getAll() {
    this.socket.emit('get', "all");
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

}

