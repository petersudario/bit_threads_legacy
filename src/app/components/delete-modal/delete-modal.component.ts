import { Component, EventEmitter, Output, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {
  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
  }

  ngOnInit(): void {
  }

  closeDelete(thread: any) {
    this.dialog.closeAll();
  }

  async deleteThread() {
    await this.firebaseService.deleteDocument(this.data.id);
    window.location.reload();
  }

}
