import { Component } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
import { FooterComponent } from './shared/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { SocketService } from './services/Sockets/socket.service';

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
  constructor(
    public router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    // Remove this listener - we'll use only the one in NotificationService
    // if (this.isAdmin) {
    //   this.socketService.listen('newOrderNotification').subscribe((data: any) => {
    //     console.log('✅ WebSocket notification received:', data);
    //     const userName = data.userName && data.userName !== 'undefined undefined' ? data.userName : 'a customer';
    //     this.toastr.success(`New order placed by ${userName}`);
    //   });
    // }
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
