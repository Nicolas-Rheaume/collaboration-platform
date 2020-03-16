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

    this.us.getLoggedUser().subscribe(user => {
      console.log(user);
      if(user != null)
        this.username = user.username;
    });


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
    if(this.us.user != null) {
      return true;
    } else {
      return false;
    }
  }

  onLogout() {
    this.us.logout();
  }

}
