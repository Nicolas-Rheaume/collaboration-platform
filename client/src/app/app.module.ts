import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from './material-module';

import { ContenteditableModule } from '@ng-stack/contenteditable';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularSplitModule } from 'angular-split';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatDialogModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserService } from './services/user.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ContentComponent } from './pages/content/content.component';
import { ContributorsComponent } from './components/contributors/contributors.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { ContentService } from './services/content.service';
import { CorpusService } from './services/corpus.service';
import { AdministrationComponent } from './pages/administration/administration.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SocketService } from './services/socket.service';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { EditableComponent } from './components/editor/editable/editable.component';
import { ToolbarComponent } from './components/editor/toolbar/toolbar.component';

import { ContenteditableDirective } from './components/editor/editable/editable.directive';

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
		PageNotFoundComponent,
		ViewerComponent,
		EditableComponent,
		ToolbarComponent,

		ContenteditableDirective,
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
		AngularSplitModule.forRoot(),
	],
	providers: [SocketService, UserService, ContentService, CorpusService, AuthGuard, AdminGuard],
	bootstrap: [AppComponent],
})
export class AppModule {}
