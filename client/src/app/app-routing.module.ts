import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { SubjectComponent } from './components/subject/subject.component';
import { UsersComponent } from './components/users/users.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'subject/:id', component: SubjectComponent },
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
