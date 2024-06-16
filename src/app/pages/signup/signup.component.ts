import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})

export class SignupComponent {
  @Output() isSigned = new EventEmitter<void>()

  isSignedIn = false;
  constructor(public firebaseService : FirebaseService, private router: Router) {}

  ngOnInit() {
    if(localStorage.getItem('user') !== null)
    this.isSignedIn = true
    else
    this.isSignedIn = false
  }

  async onSignup(email: string, password: string, username: string) {
    await this.firebaseService.signUp(email, password, username)
    if(this.firebaseService.isLogged)
      {
        this.isSignedIn = true
        this.router.navigateByUrl('');
        this.isSigned.emit();
      }
  }

}
