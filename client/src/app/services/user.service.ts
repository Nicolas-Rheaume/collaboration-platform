import { Injectable } from '@angular/core';
import { Subscription, observable } from 'rxjs';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User, Role } from '../models/user.model';
import { SocketService } from './socket.service';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*****************************************************************************
   *  VARIABLES
   ****************************************************************************/

  public currentUser: User = null;
  private sub: Subscription;
  public isAuthenticating: boolean = true;
  public token: string = null;


  /*****************************************************************************
   *  MAIN
   ****************************************************************************/
  constructor(
    private router: Router,
    private socket: SocketService,
  ) {  
    // User has been identified
    this.sub = this.socket.response('user/validated').subscribe(({success, token, user}) => {
      if(success === true) {
        this.isAuthenticating = false;
        this.saveUserData(token, user);
        this.router.navigate(['/']);
      }
    });

    // User has been identified
    this.sub = this.socket.response('user/currentUser').subscribe((user) => {
      this.isAuthenticating = false;
      this.currentUser = User.map(user);
    });

    // Check if the user's JWT token is still valid and authenticate 
    if(this.tokenExists()) {
      this.authenticateToken();
    }
  }

  /*****************************************************************************
   *  WEB SOCKETS RESPONSE
  *****************************************************************************/
  public register(user: User) {  this.socket.request('user/register', user); }
  public login(user: User) {  this.socket.request('user/login', user); }
  public authenticateToken() {  this.socket.request('user/authenticate', this.token); }

  /*****************************************************************************
   *  REGISTRATION
  ****************************************************************************/

  // Store user data in local storage
  public saveUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.currentUser = User.map(user);
  }

  // log out
  public logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.clear();
  }

  // Check if the user is connected
  public isConnected(): boolean {
    if(this.currentUser != null) return true;
    else return false;
  }

  // Check if the user is an admin
  public isAdmin(): boolean {
    if(this.isConnected()) {
      if(this.currentUser.role === Role.admin) return true;
      else return false;
    }
  }

  // Check if the client has a token
  public tokenExists(): boolean {
    if(!this.token) this.token = localStorage.getItem('id_token');
    if(!this.token) return false;
    else return true;
  }

   /*****************************************************************************
   *  WEB SOCKETS REQUESTS
   ****************************************************************************/
  public getTop5Users(username: string) {
    this.socket.request('get-top5', username);
  } 
}
