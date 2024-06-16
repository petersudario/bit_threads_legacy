import { Component, EventEmitter, Output, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.css'],
})
export class ModalComponent implements OnInit {
  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    console.log(this.data);
  }

  ngOnInit(): void {}
  @Output() imageUploaded = new EventEmitter<File>();
  imageUrl: string | null = null;

  closeEdit() {
    this.dialog.closeAll();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.convertToBase64(file);
    this.imageUploaded.emit(file);
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onEdit (id: string, postTitle: string, postText: string, imageInput: HTMLInputElement, data: any) {
    data.date = new Date();
    let updatedData = {
      username: data.username,
      postTitle: postTitle,
      date: data.date,
      postText: postText,
    };
    
    this.dialog.closeAll();
    await this.firebaseService.updateDocument(
      data.id, 
      updatedData, 
      imageInput.files && imageInput.files.length > 0 ? imageInput : null
    );
    this.router.navigateByUrl('threads');
    
    window.location.reload();

  }

}
