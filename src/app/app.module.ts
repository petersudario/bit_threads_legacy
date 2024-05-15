import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirebaseService } from './services/FirebaseService.service';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThreadsComponent } from './pages/threads/threads.component';
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NavbarComponent, SigninComponent, SignupComponent, FooterComponent, ThreadsComponent, PostComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      projectId: 'threads-angular',
      appId: '1:946417477635:web:77c2b4460ef01be5830636',
      databaseURL: 'https://threads-angular-default-rtdb.firebaseio.com',
      storageBucket: 'threads-angular.appspot.com',
      apiKey: 'AIzaSyBE-pfuSzb7H8csIQ0QbE3XM1sNYRQxELU',
      authDomain: 'threads-angular.firebaseapp.com',
      messagingSenderId: '946417477635',
      measurementId: 'G-9ZYKCKYFPQ',
    }),
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
