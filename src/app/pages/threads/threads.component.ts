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
    });
  }

}
