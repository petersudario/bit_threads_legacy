import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  isSignedIn = false;
  signupFormErrors: any = {}; // Object to hold form errors
  userExistsError = false; // Flag to indicate user or email already exists

  constructor(
    private fb: FormBuilder,
    public firebaseService: FirebaseService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSignup() {
    if (this.signupForm.valid) {
      const { email, password, username } = this.signupForm.value;

      try {
        const emailExists = await this.firebaseService.checkIfUserExists('email', email);
        const usernameExists = await this.firebaseService.checkIfUserExists('username', username);

        if (emailExists) {
          this.signupFormErrors.email = 'Este e-mail já está cadastrado. Por favor, utilize outro e-mail.';
          return;
        } else {
          this.signupFormErrors.email = null;
        }

        if (usernameExists) {
          this.signupFormErrors.username = 'Este nome de usuário já está em uso. Por favor, escolha outro.';
          return;
        } else {
          this.signupFormErrors.username = null;
        }

        await this.firebaseService.signUp(email, password, username);
        
        if (this.firebaseService.isLogged) {
          this.isSignedIn = true;
          this.router.navigateByUrl('');
        }
      } catch (error) {
        console.error('Error checking user existence or signing up:', error);
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
