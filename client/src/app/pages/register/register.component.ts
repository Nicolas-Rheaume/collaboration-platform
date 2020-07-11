import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../services/user.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
	selector: 'app-register.component',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/

	private sub: Subscription;
	public userLogin = {
		username: '',
		password: '',
	};
	public userRegistration = {
		username: '',
		email: '',
		password1: '',
		password2: '',
	};
	public registrationWarning: string = '';
	public loginWarning: string = '';

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(private us: UserService, private socket: SocketService, private router: Router) {
		// Registration Warning Message
		this.socket.response('authenticate/register-error').subscribe(message => {
			console.log(message);
			this.registrationWarning = message;
		});

		// Login Warning Message
		this.socket.response('authenticate/login-error').subscribe(message => {
			console.log(message);
			this.loginWarning = message;
		});

		// redirect to home if already logged in
		if (this.us.currentUser != null) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {}

	/*****************************************************************************
	 *  REGISTRATION METHODS
	 ****************************************************************************/

	onRegister() {
		// All fields required
		if (this.userRegistration.username === '' || this.userRegistration.email === '' || this.userRegistration.password1 === '' || this.userRegistration.password2 === '') {
			this.registrationWarning = 'Please fill in all fields';
			return;
		}

		// Require a valid email
		else if (
			!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				this.userRegistration.email,
			)
		) {
			this.registrationWarning = 'Invalid email address';
			return;
		}

		// Password confirmation
		else if (this.userRegistration.password1 != this.userRegistration.password2) {
			this.registrationWarning = 'Invalid password confirmation';
			return;
		}

		// Register user
		else {
			this.registrationWarning = '';
			this.us.register(this.userRegistration.username, this.userRegistration.email, this.userRegistration.password1);
		}
		return;
	}

	onLogin() {
		// All fields required
		if (this.userLogin.username === '' || this.userLogin.password === '') {
			this.loginWarning = 'Please fill in all fields';
			return;
		}

		// Login user
		else {
			this.loginWarning = '';
			this.us.login(this.userLogin.username, this.userLogin.password);
		}
	}
}
