import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }


  // ✅ Accessors for form fields
  get firstName() { return this.registrationForm.get('firstName'); }
  get lastName() { return this.registrationForm.get('lastName'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }

  // ✅ Passwords must match
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // ✅ Submit handler
  onSubmit() {
    if (this.registrationForm.valid) {
      const userData = this.registrationForm.value;

      this.authService.register(userData).subscribe({
        next: () => {
          localStorage.setItem('pendingUser', JSON.stringify(userData));
          this.toastr.success('✅ OTP sent to your email!', 'Success', {
            positionClass: 'toast-top-right',
            timeOut: 4000
          });

          // Delay navigation to let toast display
          setTimeout(() => {
            this.router.navigate(['/otp-verification']);
          }, 300);
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Server error';
          this.toastr.error(`❌ Registration failed: ${errorMsg}`, 'Error', {
            positionClass: 'toast-top-left',
            timeOut: 5000
          });
        }
      });
    } else {
      this.registrationForm.markAllAsTouched(); // Ensure all controls trigger validation
      this.showValidationErrors();
    }
  }

  // ❌ Show all validation errors via toast
  showValidationErrors() {
    const controls = this.registrationForm.controls;

    for (const field in controls) {
      const control = controls[field];
      if (control && control.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${this.formatFieldName(field)} is required`, 'Validation Error', {
            positionClass: 'toast-top-left',
            timeOut: 4000
          });
        } else if (control.errors?.['minlength']) {
          this.toastr.error(`${this.formatFieldName(field)} must be at least ${control.errors['minlength'].requiredLength} characters`, 'Validation Error', {
            positionClass: 'toast-top-left',
            timeOut: 4000
          });
        } else if (control.errors?.['maxlength']) {
          this.toastr.error(`${this.formatFieldName(field)} must be at most ${control.errors['maxlength'].requiredLength} characters`, 'Validation Error', {
            positionClass: 'toast-top-left',
            timeOut: 4000
          });
        } else if (control.errors?.['email']) {
          this.toastr.error(`Invalid email format`, 'Validation Error', {
            positionClass: 'toast-top-left',
            timeOut: 4000
          });
        } else if (control.errors?.['pattern']) {
          this.toastr.error(`Password must include at least 1 uppercase, 1 number, and 1 symbol`, 'Validation Error', {
            positionClass: 'toast-top-left',
            timeOut: 4000
          });
        }
      }
    }

    if (this.registrationForm.errors?.['passwordMismatch']) {
      this.toastr.error(`Passwords do not match`, 'Validation Error', {
        positionClass: 'toast-top-left',
        timeOut: 4000
      });
    }
  }

  private formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


}
