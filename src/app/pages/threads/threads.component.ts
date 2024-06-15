import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/edit-modal/modal-component.component';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css'],
})
export class ThreadsComponent implements OnInit {
  threads: any[] = [];
  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog
  ) {}
  loggedUser: string = '';

  ngOnInit(): void {
    this.fetchThreads();
    this.setLoggedUser();
  }

  setLoggedUser() {
    this.firebaseService.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedUser = user.email.split('@')[0];
      }
    });
  }

  deleteThread(thread: any) {
    this.firebaseService.deleteDocument(thread.id);
    this.fetchThreads();
  }

  openEdit(thread: any) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: thread,
    });
  }

  closeEdit(thread: any) {
    this.dialog.closeAll();
  }

  fetchThreads() {
    this.firebaseService.getDocuments().subscribe((threads: any[]) => {
      this.threads = threads;
      this.threads.map((thread) => {
        let today = new Date();
        let difference = today.getTime() - thread.date.toDate().getTime();

        let daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hoursDifference = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutesDifference = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        let secondsDifference = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysDifference > 0) {
          thread.date = daysDifference + ' dia(s) atrás';
        } else if (hoursDifference > 0) {
          thread.date = hoursDifference + ' hora(s) atrás';
        } else if (minutesDifference > 0) {
          thread.date = minutesDifference + ' minuto(s) atrás';
        } else if (secondsDifference > 0) {
          thread.date = secondsDifference + ' segundo(s) atrás';
        } else {
          thread.date = 'Agora';
        }
      });
    });
  }
}
