import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet ,Router} from '@angular/router';
import { NavbarComponent } from './components/navbar-components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,NavbarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  constructor(public router: Router) {}

  get hideNavbar(): boolean {
    return ['/login', '/register','/otp-verification','/otp-complete','/password-reset','/password-reset-confirm'].includes(this.router.url);
  }}
