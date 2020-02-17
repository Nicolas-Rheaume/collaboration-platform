import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { SubjectComponent } from './components/subject/subject.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'subject', component: SubjectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    
  ]
})
export class AppRoutingModule { }
