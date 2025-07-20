import { Component } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
// Remove this import: import { io } from 'socket.io-client';
import { FooterComponent } from './shared/footer/footer.component';

import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { SocketService } from './services/Sockets/socket.service'; // Add this import

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
  // Remove this: private socket: any;
  constructor(
    public router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private socketService: SocketService // Inject the SocketService
  ) {}

  ngOnInit(): void {
    // Remove the direct socket connection
    // this.socket = io('http://localhost:3000');

    // Instead, use the SocketService
    if (this.isAdmin) {
      this.socketService.listen('newOrderNotification').subscribe((data: any) => {
        console.log('✅ WebSocket notification received:', data);
        this.toastr.success(`New order placed by ${data.userName || 'a customer'}`);
      });
    }
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
