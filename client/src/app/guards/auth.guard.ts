import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
      private us: UserService, 
      private router:Router)
      { }

  canActivate() {
    return true;
    /*
    if(this.us.loggedIn()) {
      return true;
    } else {
      this.router.navigate(['/register']);
      return false;
    }
    */
  }
}