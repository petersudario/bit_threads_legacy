import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/edit-modal/modal-component.component';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import { CommentModalComponent } from 'src/app/components/comment-modal/comment-modal.component';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css'],
})

export class ThreadsComponent implements OnInit {
  threads: any[] = [];
  loggedUser: string = '';
  userInfo: any;
  @Output() isLogout = new EventEmitter<void>();
  isSignedIn: boolean;
  
  constructor(
    public firebaseService: FirebaseService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    if (localStorage.getItem('user') !== null) {
      this.isSignedIn = true;
    } else {
      this.isSignedIn = false;
    }
    this.fetchThreads();
    this.loggedUser = await this.firebaseService.getUserName();
    this.userInfo = await this.firebaseService.getUserInfo();
  }

  setLoggedUser() {
    this.firebaseService.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedUser = user.email.split('@')[0];
      }
    });
  }

  async onComment(thread: any) {
    this.dialog.open(CommentModalComponent, {
      width: '900px',
      height: '600px',
      data: thread,
    });
  }

  openEdit(thread: any) {
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: thread,
    });
  }

  openDelete(thread: any) {
    this.dialog.open(DeleteModalComponent, {
      data: thread,
    });
  }

  async fetchThreads() {
    this.firebaseService.getDocuments().subscribe((threads: any[]) => {
      this.threads = threads;
      let thread_profile_picture = '';
      this.threads.map((thread) => {
        this.firebaseService.getThreadProfilePicture(thread.username).then((url) => {
          thread_profile_picture = url;
        }).then(() => {

          thread.profile_picture = thread_profile_picture;
        }
        );
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
