import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';
import { CommentDeleteModalComponent } from '../comment-delete-modal/comment-delete-modal.component';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {
  comments: any[] = [];
  commentForm: FormGroup;
  signedUser: string;

  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, this.emptyValidator]],
    });
    this.comments = await this.firebaseService.getComments(this.data.id);
    this.signedUser = await this.firebaseService.getUserName();
  }

  closeComment() {
    this.dialog.closeAll();
  }

  emptyValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.trim() === '') {
      return { empty: true };
    }
    return null;
  }

  async onCommenting() {
    if (this.commentForm.invalid) {
      Object.values(this.commentForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const commentText = this.commentForm.value.comment;

    try {
      const username = await this.firebaseService.getUserName();

      await this.firebaseService.commentOnThread(this.data.id, commentText, username);
      this.comments = await this.firebaseService.getComments(this.data.id);
      this.commentForm.reset();
    } catch (error) {
      console.error('Error posting comment:', error); // Debugging line
    }
  }

  async onDeleteComment(id: string) {
    let data = await this.firebaseService.getComment(id);
    this.dialog.open(CommentDeleteModalComponent, {
      data: data,
    }
    )
  }
}
