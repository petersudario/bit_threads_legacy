import { Component, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  @Output() isSigned = new EventEmitter<void>();

  signinForm: FormGroup;
  isSignedIn = false;
  showNotification = false;
  notificationMessage = '';

  constructor(
    private fb: FormBuilder,
    public firebaseService: FirebaseService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSignin() {
    if (this.signinForm.valid) {
      const { email, password } = this.signinForm.value;

      try {
        // Check if user exists with the provided email
        const emailExists = await this.firebaseService.checkIfUserExists('email', email);
        
        if (emailExists) {
          // If user exists, attempt sign in
          await this.firebaseService.signIn(email, password);
          
          if (this.firebaseService.isLogged) {
            this.isSignedIn = true;
            this.isSigned.emit();
            await this.router.navigateByUrl('');
            window.location.reload();
          }
        } else {
          this.showNotification = true;
          this.notificationMessage = 'Usuário com este e-mail não existe.';
        }
      } catch (error) {
        console.error('Error signing in:', error);
        this.showNotification = true;
        this.notificationMessage = 'Senha ou e-mail incorretos. Por favor, tente novamente.';
      }
    } else {
      console.log('Form is invalid');
    }
  }

  redirect(route: string) {
    this.router.navigate([route]);
  }

  closeNotification() {
    this.showNotification = false;
    this.notificationMessage = '';
  }
}
