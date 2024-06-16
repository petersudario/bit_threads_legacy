import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileModalComponent } from 'src/app/components/edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username : String;
  user: any;
  user_profile_picture_url: string;
  user_description: string;
  user_banner_url: string;

  constructor(
    public firebaseService: FirebaseService, 
    private router : Router,     
    public dialog: MatDialog
  ) {
  }

  async ngOnInit() {
    this.username = await this.firebaseService.getUserName();
    this.user = await this.firebaseService.getUserInfo();
    this.user_profile_picture_url = this.user[4];
    this.user_description = this.user[3];
    this.user_banner_url = this.user[5];
  }

  openEditProfile(){
    this.dialog.open(EditProfileModalComponent, {
      width: '400px',
      data: this.user
    });
    
  }

}
