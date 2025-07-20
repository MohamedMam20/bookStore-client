import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
declare const google: any;


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const formData = this.loginForm.value;

      this.authService.login(formData).subscribe({
        next: (res) => {
          localStorage.setItem('authToken', res.token);

          const role = res.user?.role || 'user'; // default to 'user' if undefined
          this.toastr.success(' Login successful!');

          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.toastr.error(
            err.error.message || '❌ Login failed. Please try again.'
          );
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.toastr.warning('⚠️ Enter a valid email or password.');
    }
  }


  signInWithFacebook(): void {
    console.log('Sign in with Facebook');
  }
signInWithGoogle(): void {
  google.accounts.id.initialize({
    client_id: '634039215831-25c4o3plsd6745grjshosb04t1e4c99a.apps.googleusercontent.com',
    callback: (response: any) => this.handleGoogleCredential(response),
  });

  google.accounts.id.renderButton(
    document.getElementById('google-signin-button')!,
    { theme: 'outline', size: 'large' }
  );

  google.accounts.id.prompt();
}

handleGoogleCredential(response: any): void {
  const token = response.credential;

  this.authService.googleLogin(token).subscribe({
    next: (res) => {
      localStorage.setItem('authToken', res.token);

      const role = res.user?.role || 'user';
      this.toastr.success('✅ Google login successful!');

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    },
    error: (err) => {
      this.toastr.error(err?.error?.message || '❌ Google Login failed');
    }
  });
}




  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/password-reset']);
  }

  onClose(): void {
    console.log('Close modal');
  }
}
