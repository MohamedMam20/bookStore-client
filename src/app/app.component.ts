import { Component , OnInit } from '@angular/core';

// import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
// import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';


import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';

//footer
import { FooterComponent } from './shared/footer/footer.component';

//socket
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
// import {io} from 'socket.io-client';
import { SocketService } from './services/Sockets/socket.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule , FooterComponent],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private socket: any;
  constructor(public router: Router , private toastr: ToastrService,
    private authService: AuthService , private socketSrvices:SocketService) {}

  // ngOnInit(): void {
  //   this.socket = io('http://localhost:3000');
  //   this.socket.on('newOrderNotification', (data: any) => {
  //   console.log('✅ WebSocket connected to server');
  //    if(this.isAdmin){
  //     this.toastr.success(`New order placed by ${data.userName}`);
  //    }
  //   });
  // }

  ngOnInit(): void {
    // this.socketSrvices.listenToNewOrders().subscribe(data:any) =>{
    //   console.log('📩 Received new order notification:', data);
    //   if (this.authService.isAdmin()){
    //     const name = data?.user?.name || data?.userName || 'User';
    //     this.toastr.success(`New order placed by ${name}`)
    //   }
    // }
  }

  get isAdmin():boolean {
    return this.authService.currentUser?.role === 'admin';
  }

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

  get hideFooter():boolean {
    const hiddenRoutes =[
       '/login',
      '/register',
      '/otp-verification',
      '/otp-complete',
      '/password-reset',
      '/password-reset-confirm',
    ];
    return (
      hiddenRoutes.includes(this.router.url) || this.router.url.startsWith('/admin')
    );
  }
}
