import { Component , OnInit } from '@angular/core';

// import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
// import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';


import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';

//socket
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
import {io} from 'socket.io-client';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private socket: any;
  constructor(public router: Router , private toastr: ToastrService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.socket = io('http://localhost:3000');
    this.socket.on('newOrderNotification', (data: any) => {
    console.log('✅ WebSocket connected to server');
     if(this.isAdmin){
      this.toastr.success(`New order placed by ${data.userName}`);
     }
    });
  }

  get isAdmin():boolean {
    return this.authService.currentUser?.role === 'admin';
  }

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
