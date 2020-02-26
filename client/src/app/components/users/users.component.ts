import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from "../../services/user.service";
import { Observable, of, throwError, Subscription  } from 'rxjs';

import { User } from '../../models/user.model'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  users: User[] = [] as User[];
  newUser: User = new User();

  message: String;

  constructor(
    private us: UserService
  ) { }

  ngOnInit() {
    this.sub = this.us.message.subscribe(mes => {
      this.message = mes;
      console.log(mes);
    });


    this.us.getMessage();


   this.us.getUsers().subscribe(users => {
    this.users = User.maps(users);
    console.log(this.users);
   }, err => console.log(err)
   );

  } 

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getMessage() {
    this.us.getMessage();
  }

  addUser(): void {
    this.us.createUser(this.newUser).subscribe(data => {
      this.users.push(User.map(data));
      this.newUser = new User();
      console.log(this.users);
    });
  }

  removeUser(index: number): void {
    this.us.deleteUser(this.users[index]).subscribe(user => {
      this.users.splice(index, 1);
      console.log(this.users);
    });
    /*
    this.users.splice(index, 1);
    this.us.deleteUser(this.users[index]).subscribe();
    */
  }


  getUsers(): void {
    this.us.getUsers().subscribe(users => {
      this.users = users as User[];
    });
  }



}
