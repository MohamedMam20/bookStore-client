import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-password-reset-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.css']
})
export class PasswordResetRequestComponent implements OnInit {
  resetRequestForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

 
  onSubmit() {
    if (this.resetRequestForm.valid) {
      this.loading = true;
      const email = this.resetRequestForm.value.email;

      // Store email for next step
      localStorage.setItem('resetEmail', email);

      // Call the backend API
      this.authService.requestPasswordReset(email).subscribe({
        next: (res) => {
          console.log('✅ OTP sent:', res.message);
          this.router.navigate(['/password-reset-confirm']);
        },
        error: (err) => {
          console.error('❌ Request failed:', err);
          alert(err.error?.message || 'Something went wrong. Please try again.');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.resetRequestForm.markAllAsTouched();
    }
  }

 
}
