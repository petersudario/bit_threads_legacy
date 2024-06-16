import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  threads: any[] = [];
  isSignedIn = false;
  constructor(public firebaseService: FirebaseService) {}

  ngOnInit() {
    if (localStorage.getItem('user') !== null) this.isSignedIn = true;
    else this.isSignedIn = false;
    this.fetchThreads();
  }

  fetchThreads() {
    this.firebaseService.getDocuments().subscribe((threads: any[]) => {
      this.threads = threads;
      this.threads.forEach((thread) => {
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

        // Truncate postText if it exceeds 80 characters
        if (thread.postText && thread.postText.length > 70) {
          thread.postText = thread.postText.substring(0, 50) + '... Ver mais';
        }
      });
    });
  }
}
