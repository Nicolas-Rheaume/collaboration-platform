import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from "../../services/user.service";
import { Observable, of, throwError  } from 'rxjs';

import { User } from '../../models/user.model'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  private sub: any;

  //users: String[] = ["Alpha", "Bravo"];
  users: User[] = [] as User[];
  newUser: User = User.newUser();
  

  constructor(
    private us: UserService
  ) { }

  ngOnInit() {
   this.us.getUsers().subscribe(users => {
     console.log(users);
    this.users = users;
   });
  } 

  ngOnDestroy() {
  }

  addUser(): void {
    /*
    this.users.push(User.newUser());
    this.newUser = User.newUser();
    */
    this.us.createUser(this.newUser).subscribe(user => {
      this.users.push(User.newUser());
      this.newUser = User.newUser();
      console.log(this.users);
    });
  }

  removeUser(index: number): void {
    this.users.splice(index, 1);
    this.us.deleteUser(this.users[index]).subscribe();
  }


  getUsers(): void {
    this.us.getUsers().subscribe(users => {
      this.users = users;
    });
  }



}
