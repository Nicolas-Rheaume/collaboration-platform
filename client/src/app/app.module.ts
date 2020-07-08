// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from './material-module';

// DEPENDENCIES
import { ContenteditableModule } from '@ng-stack/contenteditable';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularSplitModule } from 'angular-split';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatDialogModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeAgoPipe } from 'time-ago-pipe';
import { InViewportModule } from '@thisissoon/angular-inviewport';
import { ScrollSpyModule } from '@thisissoon/angular-scrollspy';

// ANGULAR APP
import { AppComponent } from './app.component';

// PAGES
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContentComponent } from './pages/content/content.component';
import { AdministrationComponent } from './pages/administration/administration.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { CorpusComponent } from './pages/corpus/corpus.component';
import { OverviewComponent } from './pages/corpus/overview/overview.component';
import { CorpusDocumentsComponent } from './pages/corpus/documents/documents.component';
import { SearchComponent } from './pages/search/search.component';
import { ContentEditor } from './pages/content/editor/editor.component';
import { ContentExplorer } from './pages/content/explorer/explorer.component';

// GUARDS
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// SERVICES
import { UserService } from './services/user.service';
import { ContentService } from './services/content.service';
import { SocketService } from './services/socket.service';

// COMPONENTS
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

// SIDE NAVS
import { LeftnavComponent } from './components/sidenav/leftnav/leftnav.component';
import { RightnavComponent } from './components/sidenav/rightnav/rightnav.component';
import { TableofcontentComponent } from './components/sidenav/tableofcontent/tableofcontent.component';
import { ContentSideNav } from './components/sidenav/content/content.component';
import { NotfoundSideNav } from './sidenavs/notfound/notfound.component';
import { FriendlistComponent } from './sidenavs/friendlist/friendlist.component';




import { ContributorsComponent } from './components/contributors/contributors.component';
import { EditComponent } from './components/editor/edit/edit.component';
import { ExplorerComponent } from './components/explorer/explorer.component';

import { EditableComponent } from './components/editor/edit/editable/editable.component';
import { ContenteditableDirective } from './components/editor/edit/editable/editable.directive';
import { CreateConceptComponent } from './pages/dashboard/create-concept/create-concept.component';

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
		EditComponent,
		ExplorerComponent,
		TimeAgoPipe,
		AdministrationComponent,
		ProfileComponent,
		PageNotFoundComponent,
		ViewerComponent,
		EditableComponent,
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
		ContentEditor,
		ContentExplorer,
		ContentSideNav,
		CreateConceptComponent
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
	entryComponents: [
		CreateConceptComponent
	],
	providers: [SocketService, UserService, ContentService, AuthGuard, AdminGuard],
	bootstrap: [AppComponent],
})
export class AppModule {}
