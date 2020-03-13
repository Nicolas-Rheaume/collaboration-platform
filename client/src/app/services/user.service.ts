import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {catchError, retry, map, tap, mapTo} from 'rxjs/internal/operators';
import { Observable, of, throwError, Subscriber, BehaviorSubject, Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
//import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*****************************************************************************
   *  VARIABLES
   ****************************************************************************/

  private sub: Subscription;
  private apiURL = environment.api + '/users';
  private socket: SocketIOClient.Socket = io(environment.api + '/users');
  public currentUser: User = new User();

  // TO DELETE

  //public users: Observable<User[]> = this.socket.fromEvent<User[]>('users');
  public message: Observable<String>;

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly refresh_token = 'refresh_token';

  public currentUserSubject: BehaviorSubject<User>;
  
  authToken: any;
  user: any;

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

    this.sub = this.getCurrentUser().subscribe(user => {
      if(user != null)
        this.currentUser = User.map(user);
    });


  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /*****************************************************************************
   *  WEB SOCKETS REQUESTS
   ****************************************************************************/

  public getCurrentUser = () => {
    return Observable.create((observer) => {
        this.socket.on('current user', (message) => {
            observer.next(message);
        });
    });
  }

  public registerSocket(user: User) {
    this.socket.emit('register', user);
  }

  /*****************************************************************************
   *  HTTP REQUESTS
   ****************************************************************************/

   // Registration
  public register(user): Observable<any> {
    return this.http.post<User>(this.apiURL + `/register`, user, this.httpOptions).pipe(
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
    return this.http.post<User>(this.apiURL + `/authenticate`, user, this.httpOptions);
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
    return this.http.post<User>(this.apiURL + `/create`, user, { headers: { 'Content-Type': 'application/json' }});
  }

  public deleteUser(user: User): Observable<User> {
    console.log(user)
    return this.http.post<User>(this.apiURL + `/delete`, user, { headers: { 'Content-Type': 'application/json' }});
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

    return this.http.get<User[]>(this.apiURL + `/getUsers`);
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
    return this.http.post<String>(this.apiURL + `/saveUsers`, users, this.httpOptions);
  } 

  public getUser(): Observable<any> {
    return this.http.get(this.apiURL + `/user`);
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
