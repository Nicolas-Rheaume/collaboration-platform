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

import { ContentEditorComponent } from './pages/content/editor/editor.component';
import { ContentEditorOverviewComponent } from './pages/content/editor/overview/overview.component';
import { ContentEditorEditComponent } from './pages/content/editor/edit/edit.component';
import { EditableComponent } from './pages/content/editor/edit/editable/editable.component';
import { ContenteditableDirective } from './pages/content/editor/edit/editable/editable.directive';

import { ContentExplorerComponent } from './pages/content/explorer/explorer.component';
import { ContentExplorerOverviewComponent } from './pages/content/explorer/overview/overview.component';
import { ContentExplorerReadComponent } from './pages/content/explorer/read/read.component';

import { ContentLeftnavComponent } from './pages/content/leftnav/leftnav.component';
import { ContentLeftnavTableofcontentComponent } from './pages/content/leftnav/tableofcontent/tableofcontent.component';

import { ContentRightnavComponent } from './pages/content/rightnav/rightnav.component';

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
// import { EditComponent } from './components/editor/edit/edit.component';
import { ExplorerComponent } from './components/explorer/explorer.component';

// import { EditableComponent } from './components/editor/edit/editable/editable.component';
// import { ContenteditableDirective } from './components/editor/edit/editable/editable.directive';
import { CreateConceptComponent } from './pages/dashboard/create-concept/create-concept.component';
import { EditorOverviewComponent } from './components/editor/editor-overview/editor-overview.component';
// import { ReadComponent } from './components/explorer/read/read.component';
import { ExplorerOverviewComponent } from './components/explorer/explorer-overview/explorer-overview.component';
import { EditorNavbarComponent } from './components/editor/editor-navbar/editor-navbar.component';
import { ExplorerNavbarComponent } from './components/explorer/explorer-navbar/explorer-navbar.component';
import { ContentExplorerCorpusComponent } from './pages/content/explorer/corpus/corpus.component';
import { ContentCreateDocumentComponent } from './pages/content/leftnav/create-document/create-document.component';
import { ContentExplorerRecommendedComponent } from './pages/content/explorer/recommended/recommended.component';

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
		ContentEditorEditComponent,
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
		ContentSideNav,
		CreateConceptComponent,
		EditorOverviewComponent,
		ContentExplorerReadComponent,
		ExplorerOverviewComponent,
		EditorNavbarComponent,
		ExplorerNavbarComponent,
		ContentEditorComponent,
		ContentExplorerComponent,
		ContentLeftnavComponent,
		ContentRightnavComponent,
		ContentEditorOverviewComponent,
		ContentLeftnavTableofcontentComponent,
		ContentExplorerOverviewComponent,
		ContentExplorerCorpusComponent,
		ContentCreateDocumentComponent,
		ContentExplorerRecommendedComponent,
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
	entryComponents: [CreateConceptComponent, ContentCreateDocumentComponent],
	providers: [SocketService, UserService, ContentService, AuthGuard, AdminGuard],
	bootstrap: [AppComponent],
})
export class AppModule {}
