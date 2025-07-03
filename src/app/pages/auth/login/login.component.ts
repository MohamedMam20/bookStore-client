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
          this.toastr.success(' Login successful!');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.toastr.error(
            err.error.message || '❌ Login failed. Please try again.'
          );
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
    console.log('Sign in with Google');
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/password-reset']);
  }

  onClose(): void {
    console.log('Close modal');
  }
}
