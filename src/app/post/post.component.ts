import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  constructor(
    public firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  @Output() imageUploaded = new EventEmitter<File>();
  imageUrl: string | null = null;

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

  async getUserEmail(): Promise<string> {
    const username = (await this.firebaseService.firebaseAuth.currentUser)
      ?.email;
    if (!username) {
      throw new Error('User not logged in');
    }
    const trimmedUsername = username.split('@')[0];
    return trimmedUsername;
  }

  async onPosting(
    postTitle: string,
    postText: string,
    imageInput: HTMLInputElement
  ) {
    const date = new Date();
    const username = this.getUserEmail();
    this.firebaseService.addDocument(
      await username,
      postTitle,
      date,
      postText,
      imageInput.files && imageInput.files.length > 0 ? imageInput : null
    );
    this.router.navigateByUrl('threads');
  }
}
