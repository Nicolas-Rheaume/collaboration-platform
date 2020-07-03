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
import { InViewportModule } from '@thisissoon/angular-inviewport';
import { ScrollSpyModule } from '@thisissoon/angular-scrollspy';

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
import { AdministrationComponent } from './pages/administration/administration.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SocketService } from './services/socket.service';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { EditableComponent } from './components/editor/editable/editable.component';
import { ToolbarComponent } from './components/editor/toolbar/toolbar.component';
import { CorpusComponent } from './pages/corpus/corpus.component';

import { ContenteditableDirective } from './components/editor/editable/editable.directive';
import { OverviewComponent } from './pages/corpus/overview/overview.component';
import { CorpusDocumentsComponent } from './pages/corpus/documents/documents.component';

import { NotfoundSideNav } from './sidenavs/notfound/notfound.component';
import { LeftnavComponent } from './components/leftnav/leftnav.component';
import { RightnavComponent } from './components/rightnav/rightnav.component';
import { TableofcontentComponent } from './sidenavs/tableofcontent/tableofcontent.component';
import { FriendlistComponent } from './sidenavs/friendlist/friendlist.component';
import { SearchComponent } from './pages/search/search.component';

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
		CorpusComponent,
		ViewerComponent,
		ContenteditableDirective,
		OverviewComponent,
		CorpusDocumentsComponent,
		NotfoundSideNav,
		LeftnavComponent,
		RightnavComponent,
		TableofcontentComponent,
		FriendlistComponent,
		SearchComponent,
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
		InViewportModule,
		ScrollSpyModule.forRoot(),
	],
	providers: [SocketService, UserService, ContentService, AuthGuard, AdminGuard],
	bootstrap: [AppComponent],
})
export class AppModule {}
