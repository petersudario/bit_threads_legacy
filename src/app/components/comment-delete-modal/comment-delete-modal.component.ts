import { Component, EventEmitter, Output, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-comment-delete-modal',
  templateUrl: './comment-delete-modal.component.html',
  styleUrls: ['./comment-delete-modal.component.css']
})
export class CommentDeleteModalComponent implements OnInit {




  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
  }

  async ngOnInit() {
  }
  
  closeDelete() {
    this.dialog.closeAll();
  }

  async deleteComment() {
    console.log('Deleting comment:', this.data.id);
    try {
      await this.firebaseService.deleteComment(this.data.id);
      this.dialog.closeAll();
    } catch (error) {
      console.error('Error deleting comment:', error); 
    }
  }

}
