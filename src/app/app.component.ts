import { Component } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';


import {  OnInit } from '@angular/core';


// import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
// import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';

//socket
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
import { io } from 'socket.io-client';
import { FooterComponent } from './shared/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    FooterComponent,
    ChatbotComponent,
  ],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private socket: any;
  constructor(
    public router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.socket = io('http://localhost:3000');
    this.socket.on('newOrderNotification', (data: any) => {
      console.log('✅ WebSocket connected to server');
      if (this.isAdmin) {
        this.toastr.success(`New order placed by ${data.userName}`);
      }
    });
  }

  get isAdmin(): boolean {
    return this.authService.currentUser?.role === 'admin';
  }

  get hideComponent(): boolean {
    const hiddenRoutes = [
      '/login',
      '/register',
      '/otp-verification',
      '/otp-complete',
      '/password-reset',
      '/password-reset-confirm',
    ];

    return (
      hiddenRoutes.includes(this.router.url) ||
      this.router.url.startsWith('/admin')
    );
  }
}
