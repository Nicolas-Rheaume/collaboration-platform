import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {catchError, retry} from 'rxjs/internal/operators';
import { Observable, of, throwError  } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:3000/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'jwt-token'
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  public register(user: User): Observable<any> {
    return this.http.post<User>(`http://192.168.21.239:3000/user/register`, user, this.httpOptions);
  }

  public getUsers(): Observable<any> {
    return this.http.get(`http://192.168.21.239:3000/user/findAll`);
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
