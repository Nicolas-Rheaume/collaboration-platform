import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (
    private us: UserService,
    private router: Router
  ){ }

  canActivate(): Observable<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      if(this.us.isConnected()) observer.next(true);
      else {
        if(!this.us.isAuthenticating) observer.next(false);
        else {
          setTimeout(() => {
            if(this.us.isConnected()) observer.next(true);
            else {
              this.router.navigate(['/']);
              observer.next(false);
            }
          }, 250);
        }
      }
    });
  }
}