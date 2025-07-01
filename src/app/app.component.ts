import { Component } from '@angular/core';

// import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
// import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';


import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';
import { ProductDetailsComponent } from "./pages/product-details/product-details.component";


@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet, NavbarComponent, CommonModule, ProductDetailsComponent],
=======
  imports: [RouterOutlet, NavbarComponent, CommonModule],
>>>>>>> f81e3c34affb691b19b319be946277375aafdbe9

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public router: Router) {}

  get hideNavbar(): boolean {
    return [
      '/login',
      '/register',
      '/otp-verification',
      '/otp-complete',
      '/password-reset',
      '/password-reset-confirm',
    ].includes(this.router.url);
  }
}
