import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { SocketService } from 'src/app/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-content-explorer',
	templateUrl: './explorer.component.html',
	styleUrls: ['./explorer.component.scss'],
})
export class ContentExplorerComponent implements OnInit, OnDestroy {
	private sub: Subscription;
	private contentTitle: string = '';

	constructor(private socket: SocketService, private activeRouter: ActivatedRoute, private cs: ContentService) {}

	ngOnInit() {
		console.log('Explorer Created');
		this.sub = this.activeRouter.params.subscribe(params => {
			this.contentTitle = params.title;
			this.cs.initializeExplorer(params.title);
		});
	}

	ngOnDestroy() {
		console.log('Explorer Destroyed');
	}
}
