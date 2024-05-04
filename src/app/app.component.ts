import { Component } from '@angular/core';
import { FirebaseService } from './services/FirebaseService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'bit-threads-nine';
  isSignedIn = false;
  constructor(public firebaseService : FirebaseService) {}

  ngOnInit() {
    if(localStorage.getItem('user') !== null)
    this.isSignedIn = true
    else
    this.isSignedIn = false
  }

  async onSignup(email: string, password: string) {
    await this.firebaseService.signUp(email, password)
    if(this.firebaseService.isLogged)
    this.isSignedIn = true
  }

  async onSignin(email: string, password: string) {
    await this.firebaseService.signIn(email, password)
    if(this.firebaseService.isLogged)
    this.isSignedIn = true
  }

  handleLogout() {
    this.isSignedIn = false
  }

}
