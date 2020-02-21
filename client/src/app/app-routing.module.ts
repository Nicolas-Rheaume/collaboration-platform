import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { SubjectComponent } from './components/subject/subject.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'subject', component: SubjectComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    
  ]
})
export class AppRoutingModule { }
