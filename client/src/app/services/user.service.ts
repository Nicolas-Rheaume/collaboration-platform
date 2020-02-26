import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {catchError, retry, map, tap} from 'rxjs/internal/operators';
import { Observable, of, throwError, Subscriber } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';

import { User } from '../models/user.model';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public users: Observable<User[]> = this.socket.fromEvent<User[]>('users');
  public message: Observable<String> = this.socket.fromEvent<String>('message');

  apiUrl = 'http://localhost:3000/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'/*,
      'Authorization': 'jwt-token'*/
    })
  };

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  public getMessage() {
    this.socket.emit('get message', " data");
  }

  public register(user: User): Observable<any> {
    return this.http.post<User>(`http://192.168.21.239:3000/user/register`, user, this.httpOptions);
  }

  public createUser(user: User): Observable<User> {
    console.log(user);
    return this.http.post<User>(`http://192.168.21.239:3000/user/create`, user, { headers: { 'Content-Type': 'application/json' }});
  }

  public deleteUser(user: User): Observable<User> {
    console.log(user)
    return this.http.post<User>(`http://192.168.21.239:3000/user/delete`, user, { headers: { 'Content-Type': 'application/json' }});
  }

  public getUsers(): Observable<User[]>  {

    /*
    let response = this.http.get<User[]>(`http://192.168.21.239:3000/user/getUsers`);
    
    response.subscribe(res => {

      for(let i = 0; i < res.msg.length; i++) {
        console.log(res);
      }
    });
    */

    return this.http.get<User[]>(`http://192.168.21.239:3000/user/getUsers`);
    /*
    .pipe(
      map((users: User) => {
        const u: User = [

        ];
        return u;
      })
    );*/
  }

  public saveUsers(users: string[]): Observable<any> {
    return this.http.post<String>(`http://192.168.21.239:3000/user/saveUsers`, users, this.httpOptions);
  } 

  public getUser(): Observable<any> {
    return this.http.get(`http://192.168.21.239:3000/user/user`);
  }

  // Get all users
  /*
  getAllUsers(): Observable<any> {

    return this.http.get<User>().pipe(
      retry(3), catchError(this.handleError<User[]>('getUsers')));
  }
  */
}
