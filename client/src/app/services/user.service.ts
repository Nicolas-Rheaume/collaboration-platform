import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {catchError, retry, map, tap, mapTo} from 'rxjs/internal/operators';
import { Observable, of, throwError, Subscriber, BehaviorSubject, Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
//import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

import { User, Role } from '../models/user.model';
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
  private socket: SocketIOClient.Socket = io(this.apiURL);
  private userSubject: BehaviorSubject<any>;
  public user: User = null;
  public token: string = null;
 
  // TO DELETE

  //public users: Observable<User[]> = this.socket.fromEvent<User[]>('users');
  public message: Observable<String>;

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly refresh_token = 'refresh_token';

  
  authToken: any;

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
    private http: HttpClient,
    private router: Router
  ) { 

    console.log("User Service");

    this.sub = this.authenticateSocket().subscribe(auth => {
      if(auth.success === true) {
        this.storeUserData(auth.token, auth.user);
        this.router.navigate(['/']);
      }
    });

    if(this.isLoggedIn()) {
      this.getUserFromLocalStorage();
    }
  }

  public get currentUserValue(): User {
    return this.userSubject.value;
  }

  /*****************************************************************************
   *  WEB SOCKETS REQUESTS
   ****************************************************************************/

  public authenticateSocket = () => {
    return Observable.create((observer) => {
        this.socket.on('authenticate', (message) => {
            observer.next(message);
        });
    });
  }

  public registerMessage = () => {
    return Observable.create((observer) => {
        this.socket.on('register_message', (message) => {
            observer.next(message);
        });
    });
  }

  public loginMessage = () => {
    return Observable.create((observer) => {
        this.socket.on('login_message', (message) => {
            observer.next(message);
        });
    });
  }

  public registerSocket(user: User) {
    this.socket.emit('register', user);
  }

  public loginSocket(user: User) {
    this.socket.emit('login', user);
  }

  /*****************************************************************************
   *  LOCAL STORAGE
   ****************************************************************************/

  public storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = User.map(user);
  }

  public logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  public getLoggedUser(): Observable<any> {
    return Observable.create((observer) => {
      observer.next(this.user);
    });
  }

  public getCurrentUsername() {
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    return this.user;
  }

  public isLoggedIn(): boolean {
    if(!this.token) this.token = localStorage.getItem('id_token');
    if(!this.token) return false;

    const decoded = jwt_decode(this.token);
    if (decoded.exp === undefined) return null;

    let date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    if(date === undefined) return false;
    return (date.valueOf() > new Date().valueOf());
  }

  public getUserFromLocalStorage(): void {
    this.user = User.map(JSON.parse(localStorage.getItem('user')));
  }

  public isConnected(): boolean {
    if(this.user != null) return true;
    else return false;
  }

  public isAdmin(): boolean {
    if(this.isConnected()) {
      if(this.user.role === 1 || this.user.role === Role.admin) return true;
      else return false;
    }
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

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
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
    this.socket.emit('get-all');
  }

  public getTop5Users(username: string) {
    this.socket.emit('get-top5', username);
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
