import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  username: string = null;

  constructor(
    private us: UserService
  ) { }

  ngOnInit() {

    this.username = this.us.getCurrentUsername().username;

    /*

    console.log("header stuff : ");
    this.username = this.us;
    
    localStorage.getItem('user');

    console.log(localStorage.getItem('user'));

    /*
    if(this.us.loggedIn()){
      console.log(localStorage.getItem('user'));
      this.username = localStorage.getItem('user');
    }
    */
  }

  isLoggedIn() {
    if(this.us.currentUser) {
      return true;
    } else {
      return false;
    }
  }

  onLogout() {
    this.us.logout();
  }

}
