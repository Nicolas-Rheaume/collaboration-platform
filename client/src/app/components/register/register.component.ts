import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User, Role } from '../../models/user.model';
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-register.component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // VARIABLES
  userInfo: User = {
    uid: 0,
    username: '',
    email: '',
    password: '',
    role: Role.visitor
  }

  errorMessage = '';

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUser().subscribe((data) => {
      console.log(data);
    });

    this.userService.getUsers().subscribe((data) => {
      console.log(data);
    });

  }

  rightPanelActive: boolean = false;

  clickRightPanel() {
    this.rightPanelActive = !this.rightPanelActive;
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
