import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscriber, Subscription } from 'rxjs';

import { User, Role } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register.component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private sub: Subscription;

  public userLogin = {
    username: '',
    password: '',
  }

  public userRegistration = {
    username: '',
    email: '',
    password1: '',
    password2: '',
  }

  public registrationWarning: string = 'registration Warning';
  public loginWarning: string = 'Login Warning';


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private us: UserService,
) {
    // redirect to home if already logged in
    /*
    if (this.us.currentUserValue) { 
        this.router.navigate(['/']);
    }
    */
}

  ngOnInit() {

    /*
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


    this.sub = this.us.update().subscribe(data => {
      console.log(data);
    });

    this.us.authenticate();

    /*
    this.us.getUser().subscribe((data) => {
      console.log(data);
    });

    this.us.getUsers().subscribe((data) => {
      console.log(data);
    });
    */

  }

  onLogin() {
    console.log(this.userLogin);

    this.us.authenticate(this.userLogin).subscribe(data => {
      console.log(data);
        if(data.success) {
          this.us.storeUserData(data.token, data.user);
          this.loginWarning = 'You are now logged in';
          this.router.navigate(['/']);
        } else {
          this.loginWarning = data.msg;
        }
    });
  }

  onRegister() {

    // All fields required
    if(this.userRegistration.username === '' || this.userRegistration.email === '' || this.userRegistration.password1 === '' || this.userRegistration.password2 === '') {
        this.registrationWarning = "Please fill in all fields";
        return;
    } 
    
    // Require a valid email
    else if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.userRegistration.email))) {
      this.registrationWarning = "Invalid email address";
      return;
    }

    // Password confirmation
    else if(this.userRegistration.password1 != this.userRegistration.password2) {
      this.registrationWarning = "Invalid password confirmation";
      return;
    }


    // Register user
    else {
      this.registrationWarning = '';
      this.us.register(this.userRegistration).subscribe(data => {
        if(data.success) {
          this.registrationWarning = 'You are now registered and can now login';
          this.router.navigate(['/']);
        } else {
          this.registrationWarning = data.msg;
        }
      });
      return;
    }
  }

  /*
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.as.login(this.f.username.value, this.f.password.value)
          .pipe(first())
          .subscribe(
              data => {
                  this.router.navigate([this.returnUrl]);
              },
              error => {
                  this.error = error;
                  this.loading = false;
              });
  }



  onRegisterSubmit() {

    // Required Fields
    if(!this.us.validateRegister(this.userRegistration)) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate Email
    if(!this.us.validateEmail(user.email)) {
    this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register user
    this.us.registerUser(user).subscribe(data => {
    if(data.success) {
      this.flashMessage.show('You are now registered and can now login', {cssClass: 'alert-success', timeout: 3000});
      this.router.navigate(['/login']);
    } else {
      this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
      this.router.navigate(['/register']);
    }
  });
  }

  /*
  // Déclaration de la fonction ascync
  async register() {
    try {
      await this.registerWithEmailAndPassword();
      this.updateUserInfo();
      this.redirectToLoginPage();
    } catch (error) {
      // Handle Errors here.
      this.errorMessage = error.message;
      console.log(this.errorMessage);
    }
  }
  // Methode qui fait l'enregistrement des utilisateurs en créant
  async registerWithEmailAndPassword() {
    try {
      const user = await firebase.auth().createUserWithEmailAndPassword(this.userInfo.email, this.userInfo.password);
      this.userInfo.uid = user.user.uid;
      await user.user.updateProfile({
        displayName: this.userInfo.firstname,
        photoURL: ''
      });
    } catch (err) {
      throw err;
    }
  }

  // Cette methode fait la mise à jour de l'utilisateur puis ensuite, le logout() de authservice déconnécte l'utilisateur
  updateUserInfo() {
    this.afs.collection('Users/').doc(this.userInfo.uid).set({
      uid: this.userInfo.uid,
      email: this.userInfo.email,
      firstname: this.userInfo.firstname,
      lastname: this.userInfo.lastname,
      role: Role.Visitor
    });
    this.authService.logout();
  }
  // Methode qui redirige l'utilisateur vers la page de connexion
  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }
  // Cette methode retourne un message d'erreur quand l'email est invalid
  otherInvalid() {
    return this.errorMessage !== '';
  }
  */

}
