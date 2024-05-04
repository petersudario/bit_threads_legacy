import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ThreadsComponent } from './pages/threads/threads.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'signin',
    component: SigninComponent,
  },

  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'threads',
    component: ThreadsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
