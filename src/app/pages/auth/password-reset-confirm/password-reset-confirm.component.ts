import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-password-reset-confirm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './password-reset-confirm.component.html',
  styleUrls: ['./password-reset-confirm.component.css']
})
export class PasswordResetConfirmComponent implements OnInit, AfterViewInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  resetConfirmForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  otpInvalid = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const resetEmail = localStorage.getItem('resetEmail');
    if (!resetEmail) {
      this.router.navigate(['/password-reset']);
      return;
    }

    this.resetConfirmForm = this.fb.group({
      otpDigit1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otpDigit2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otpDigit3: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otpDigit4: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otpDigit5: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otpDigit6: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/)
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngAfterViewInit() {
    this.createParticles();
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onOtpInput(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;

    const inputs = this.otpInputs.toArray();

    if (value && index < inputs.length - 1) {
      inputs[index + 1].nativeElement.focus();
    }

    if (event.key === 'Backspace' && !value && index > 0) {
      inputs[index - 1].nativeElement.focus();
    }

    this.otpInvalid = false;
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      const controls = ['otpDigit1', 'otpDigit2', 'otpDigit3', 'otpDigit4', 'otpDigit5', 'otpDigit6'];
      digits.forEach((digit, i) => {
        this.resetConfirmForm.get(controls[i])?.setValue(digit);
      });

      const lastInput = this.otpInputs.toArray()[5];
      if (lastInput) lastInput.nativeElement.focus();
      this.otpInvalid = false;
    } else {
      this.otpInvalid = true;
    }
  }

  onSubmit() {
    if (this.resetConfirmForm.valid) {
      this.loading = true;

      const otp = [
        this.resetConfirmForm.get('otpDigit1')?.value,
        this.resetConfirmForm.get('otpDigit2')?.value,
        this.resetConfirmForm.get('otpDigit3')?.value,
        this.resetConfirmForm.get('otpDigit4')?.value,
        this.resetConfirmForm.get('otpDigit5')?.value,
        this.resetConfirmForm.get('otpDigit6')?.value
      ].join('');

      const email = localStorage.getItem('resetEmail');
      const newPassword = this.resetConfirmForm.get('newPassword')?.value;

      if (!email) {
        alert('Email not found. Please try again.');
        this.loading = false;
        return;
      }

      this.authService.resetPassword(email, otp, newPassword).subscribe({
        next: (res) => {
          alert('Password reset successful! Please login with your new password.');
          localStorage.removeItem('resetEmail');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.otpInvalid = true;
          alert(err.error?.message || 'Password reset failed. Please try again.');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      const otpControls = ['otpDigit1', 'otpDigit2', 'otpDigit3', 'otpDigit4', 'otpDigit5', 'otpDigit6'];
      const isOtpValid = otpControls.every(control => this.resetConfirmForm.get(control)?.valid);
      if (!isOtpValid) this.otpInvalid = true;
      this.resetConfirmForm.markAllAsTouched();
    }
  }

  createParticles() {
    const container = document.getElementById('particles-container');
    if (container) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(particle);
      }
    }
  }
}
