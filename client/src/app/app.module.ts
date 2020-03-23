import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon'
import { MaterialModule } from './material-module'

import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularSplitModule } from 'angular-split';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatDialogModule } from '@angular/material'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './views/header/header.component';
import { FooterComponent } from './views/footer/footer.component';
import { UserService } from './services/user.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ContentComponent } from './components/content/content.component';
import { ContributorsComponent } from './components/content/contributors/contributors.component';
import { EditorComponent } from './components/content/editor/editor.component';
import { ExplorerComponent } from './components/content/explorer/explorer.component';
import { ContentService } from './services/content.service';
import { SubjectService } from './services/subject.service';
import { AdministrationComponent } from './components/administration/administration.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SocketService } from './services/socket.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    HomeComponent,
    ContentComponent,
    ContributorsComponent,
    EditorComponent,
    ExplorerComponent,
    TimeAgoPipe,
    AdministrationComponent,
    ProfileComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatNativeDateModule,
    MatIconModule,
    CKEditorModule,
    MatDialogModule,
    MaterialModule,
    NgbModule,
    AngularSplitModule.forRoot()
  ],
  providers: [
    SocketService,
    UserService,
    ContentService,
    SubjectService,
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }