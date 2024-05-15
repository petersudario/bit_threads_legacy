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

  constructor(public firebaseService: FirebaseService, private router : Router) {}

  ngOnInit() {
    if (localStorage.getItem('user') !== null) this.isSignedIn = true;
    else this.isSignedIn = false;
  }

  logout() {
    this.isSignedIn = false;
    this.firebaseService.logout();
    this.router.navigate(['']);
    this.isLogout.emit();
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
