import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})

export class SigninComponent {
  @Output() isSigned = new EventEmitter<void>()

  isSignedIn = false;
  constructor(public firebaseService: FirebaseService, private router : Router) {}

  ngOnInit() {
    if (localStorage.getItem('user') !== null) this.isSignedIn = true;
    else this.isSignedIn = false;
  }

  async onSignin(email: string, password: string) {
    await this.firebaseService.signIn(email, password);
    if (this.firebaseService.isLogged) {
      this.isSignedIn = true;
      this.router.navigateByUrl('');
      this.isSigned.emit();
    }
  }

  redirect(route: string){
    this.router.navigate([route]);
  }
}
