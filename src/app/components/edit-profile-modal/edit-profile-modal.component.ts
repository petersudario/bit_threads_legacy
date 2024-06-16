import { Component, EventEmitter, Output, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent implements OnInit {
  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
  }

  ngOnInit(): void {}
  @Output() imageUploaded = new EventEmitter<File>();
  imageUrl: string | null = null;

  @Output() bannerImageUploaded = new EventEmitter<File>();
  bannerImageUrl: string | null = null;

  closeEdit() {
    this.dialog.closeAll();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.convertToBase64(file);
    this.imageUploaded.emit(file);
  }

  onFileSelectedBanner(event: any) {
    const bannerFile: File = event.target.files[0];
    this.convertToBase64Banner(bannerFile);
    this.bannerImageUploaded.emit(bannerFile);
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  convertToBase64Banner(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.bannerImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onEdit (id: string, description: string, imageInput: HTMLInputElement, data: any, bannerImageInput: HTMLInputElement) {
    data.date = new Date();
    console.log(data);

    let updatedData = {
      username: data[1],
      email: data[2],
      description: description ? description : data[3],
    };

    this.dialog.closeAll();
    await this.firebaseService.updateUser(
      data[0], 
      updatedData, 
      imageInput.files && imageInput.files.length > 0 ? imageInput : data[4],
      data[4],
      bannerImageInput.files && bannerImageInput.files.length > 0 ? bannerImageInput : data[5],
      data[5]
    );
    this.router.navigateByUrl('threads');
    
    window.location.reload();
  }

}
