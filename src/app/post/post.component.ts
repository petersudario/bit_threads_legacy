import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'; // Import AbstractControl
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  postForm: FormGroup; // Declare postForm of type FormGroup
  imageUrl: string | null = null;
  showNotification = false;
  notificationMessage = '';
  isSuccess = false;

  constructor(
    private fb: FormBuilder, // Inject FormBuilder
    public firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      postTitle: ['', [Validators.required, this.emptyValidator]], // Add Validators.required for required validation
      postText: ['', [Validators.required, this.emptyValidator]], // Add Validators.required for required validation
      imageInput: [''] // You can add more as needed
    });
  }

  // Custom validator to check for empty string
  emptyValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.trim() === '') {
      return { empty: true };
    }
    return null;
  }

  @Output() imageUploaded = new EventEmitter<File>();

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
    const username = (await this.firebaseService.firebaseAuth.currentUser)?.email;
    if (!username) {
      throw new Error('User not logged in');
    }
    const trimmedUsername = username.split('@')[0];
    return trimmedUsername;
  }

  async onPosting() {
    if (this.postForm.invalid) {
      // Mark all form controls as touched to display validation messages
      Object.values(this.postForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const { postTitle, postText, imageInput } = this.postForm.value;
    const date = new Date();
    const username = await this.firebaseService.getUserName();

    try {
      await this.firebaseService.addDocument(
        username,
        postTitle,
        date,
        postText,
        imageInput && imageInput.files && imageInput.files.length > 0 ? imageInput : null
      );
      this.isSuccess = true;
      this.showNotification = true;
      this.notificationMessage = 'Thread posted successfully.';
      setTimeout(() => {
        this.showNotification = false;
        this.notificationMessage = '';
        this.router.navigateByUrl('threads');
      }, 3000); // Navigate to threads page after 3 seconds
    } catch (error) {
      console.error('Error posting thread:', error);
      this.isSuccess = false;
      this.showNotification = true;
      this.notificationMessage = 'Failed to post thread. Please try again later.';
    }
  }
}
