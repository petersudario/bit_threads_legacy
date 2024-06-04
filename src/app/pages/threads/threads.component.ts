import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/FirebaseService.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  threads: any[] = [];
  constructor(public firebaseService : FirebaseService) {}

  ngOnInit(): void {
    this.fetchThreads();
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
          }
          else if (hoursDifference > 0) {
            thread.date = hoursDifference + ' hora(s) atrás';
          }
          else if (minutesDifference > 0) {
            thread.date = minutesDifference + ' minuto(s) atrás';
          }
          else if (secondsDifference > 0) {
            thread.date = secondsDifference + ' segundo(s) atrás';
          }
          else {
            thread.date = 'Agora';
          }
          });
      });
    }

  }
