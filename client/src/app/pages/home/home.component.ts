import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CorpusService } from 'src/app/services/corpus.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	constructor(private us: UserService, private ss: CorpusService, private socket: SocketService) {}

	ngOnInit() {}
}
