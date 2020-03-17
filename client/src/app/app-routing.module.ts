import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { SubjectComponent } from './components/subject/subject.component';
import { UsersComponent } from './components/users/users.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { ContentComponent } from './components/content/content.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'subject/:id', component: SubjectComponent },
  { path: 'content/:title', component: ContentComponent },
  { path: 'users', component: UsersComponent },
  { path: 'menu', component: MenuComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    
  ]
})
export class AppRoutingModule { }
