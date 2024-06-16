import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() isLogout = new EventEmitter<void>()
  isSignedIn : boolean;
  username: string;
  profile_picture_url: string;

  constructor(public firebaseService: FirebaseService, private router : Router) {}

  async ngOnInit() {
    if (localStorage.getItem('user') !== null) {
      this.isSignedIn = true;
      this.username = await this.firebaseService.getUserName();
      this.profile_picture_url = await this.firebaseService.getUserProfilePicture();
    }
    else this.isSignedIn = false;

  }

  async logout() {
    this.isSignedIn = false;
    await this.firebaseService.logout();
    this.isLogout.emit();
    await this.router.navigate(['']);
    window.location.reload()
  }

  redirect(route: string){
    this.router.navigate([route]);
  }

  isRoute(route: string){
    if (this.router.url === route){
      return true;
    }
    return false
  }
}
