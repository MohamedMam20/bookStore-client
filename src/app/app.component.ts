import { Component } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';



// import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
// import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';


import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public router: Router) {}

  get hideNavbar(): boolean {
    const hiddenRoutes = [
      '/login',
      '/register',
      '/otp-verification',
      '/otp-complete',
      '/password-reset',
      '/password-reset-confirm',
    ];

    return hiddenRoutes.includes(this.router.url) || this.router.url.startsWith('/admin');
  }
}
