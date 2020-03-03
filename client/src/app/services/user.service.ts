import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {catchError, retry, map, tap, mapTo} from 'rxjs/internal/operators';
import { Observable, of, throwError, Subscriber, BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
//import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../models/user.model';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*****************************************************************************
   *  VARIABLES
   ****************************************************************************/

  private socket: SocketIOClient.Socket = io('http://192.168.21.239:3000/users');
  //public users: Observable<User[]> = this.socket.fromEvent<User[]>('users');
  public message: Observable<String>;

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly refresh_token = 'refresh_token';

  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User> = null;
  
  authToken: any;
  user: any;

  apiUrl = 'http://localhost:3000/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'/*,
      'Authorization': 'jwt-token'*/
    })
  };

  /*****************************************************************************
   *  MAIN
   ****************************************************************************/
  constructor(
    private http: HttpClient /*,
    private jwtHelper: JwtHelperService*/
  ) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /*****************************************************************************
   *  HTTP REQUESTS
   ****************************************************************************/

   // Registration
  public register(user): Observable<any> {
    return this.http.post<User>(`http://192.168.21.239:3000/user/register`, user, this.httpOptions).pipe(
      tap(data => {
        console.log(data);
        /*this.doLoginUser(user.username, tokens)*/
      }),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      })
    );
  }

  public authenticate(user): Observable<any> {
    return this.http.post<User>(`http://192.168.21.239:3000/user/authenticate`, user, this.httpOptions);
  }

  /*
  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }
  */

  public getCurrentUsername() {
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    return this.user;
  }

  public storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    console.log("asd");
    console.log(localStorage.getItem('id_token'));
    //return this.jwtHelper.isTokenExpired('id_token');
    //return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
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

   /*****************************************************************************
   *  WEB SOCKETS REQUESTS
   ****************************************************************************/

  public getAll() {
    this.socket.emit('get', "all");
  }

  public create(user: User) {
    this.socket.emit('create', user);
  }

  public delete(user: User) {
    this.socket.emit('delete', user);
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

  public test() {
    this.socket.emit('test', "message");
  }

  public getMessage() {
    this.socket.emit('get message', " data");
  }
}
