import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

/* Main Content */
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { ContentComponent } from './pages/content/content.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdministrationComponent } from './pages/administration/administration.component';
import { AdminGuard } from './guards/admin.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { CorpusComponent } from './pages/corpus/corpus.component';
import { ViewerComponent } from './pages/viewer/viewer.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'content/:title', component: ContentComponent, canActivate: [AuthGuard] },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
	{ path: 'administration', component: AdministrationComponent, canActivate: [AdminGuard] },
	{ path: 'corpus/:title', component: CorpusComponent },
	{ path: 'corpus/:title/:user/view', component: ViewerComponent },
	//{ path: 'corpus/:title/:id/edit', component: EditComponent },
	//{ path: 'content/:user/:concept', component: EditComponent },
	//{ path: 'content/:user/:concept/:document', component: EditComponent },
	{ path: 'viewer', component: ViewerComponent },
	{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			anchorScrolling: 'enabled',
			scrollPositionRestoration: 'enabled',
		}),
	],
	exports: [RouterModule],
	providers: [],
})
export class AppRoutingModule {}
