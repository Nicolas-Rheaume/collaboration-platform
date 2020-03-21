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
  ) { 
  }

  ngOnInit() {
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
