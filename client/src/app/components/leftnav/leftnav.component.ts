import { Component, OnInit } from '@angular/core';
import { Routes, Router, NavigationEnd } from '@angular/router';

// import { RegisterComponent } from 'src/app/';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { HomeComponent } from './pages/home/home.component';
// import { ContentComponent } from './pages/content/content.component';
// import { ProfileComponent } from './pages/profile/profile.component';
// import { AdministrationComponent } from './pages/administration/administration.component';
// import { AdminGuard } from './guards/admin.guard';
// import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
// import { CorpusComponent } from './pages/corpus/corpus.component';
// import { ViewerComponent } from './components/viewer/viewer.component';

import { NotfoundSideNav } from 'src/app/sidenavs/notfound/notfound.component'
import { SideNavService } from 'src/app/services/sidenav.service';


const routes: Routes = [
	{ path: '**', component: NotfoundSideNav },
];

@Component({
  selector: 'leftnav-router',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.scss']
})
export class LeftnavComponent implements OnInit {

  private url: string = '';

  constructor(public router: Router, public sidenav: SideNavService) {

    this.router.events.subscribe((val) => {
      this.url = router.url;
    });
	}

  ngOnInit() {
  }

  getComponent(page: string): boolean {
    if(this.url.substring(0,7) == '/viewer' && page == 'table of content') { return true}
    else { return false; }

  }

}
