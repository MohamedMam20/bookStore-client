import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpService } from '../../../services/otp/otp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-verfication.component.html',
  styleUrls: ['./otp-verfication.component.css']
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpForm: FormGroup;
  resendCooldown: number = 60;
  private countdownInterval: any;
  loading: boolean = false;

  userData: any = {}; // Retrieve from localStorage

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit3: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit4: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit5: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit6: ['', [Validators.required, Validators.pattern('^[0-9]$')]]
    });
  }

  ngOnInit() {
    this.startResendTimer();

    const stored = localStorage.getItem('pendingUser');
    if (stored) {
      this.userData = JSON.parse(stored);
    } else {
      this.router.navigate(['/register']);
    }
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
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
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      const inputNames = Object.keys(this.otpForm.controls);
      digits.forEach((digit, i) => {
        this.otpForm.get(inputNames[i])?.setValue(digit);
      });

      // Autofocus last box
      const lastInput = this.otpInputs.toArray()[5];
      if (lastInput) lastInput.nativeElement.focus();
    }
  }

  private startResendTimer() {
    this.countdownInterval = setInterval(() => {
      if (this.resendCooldown > 0) {
        this.resendCooldown--;
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  onResendOtp() {
    if (this.resendCooldown === 0) {
      // You can call an API here to resend the OTP
      alert('OTP resent to your email.');
      this.resendCooldown = 60;
      this.startResendTimer();
    }
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.loading = true;
      const otp = Object.values(this.otpForm.value).join('');
      const payload = {
        ...this.userData,
        otp
      };

      this.otpService.verifyOTP(payload).subscribe({
        next: () => {
          this.loading = false;
          localStorage.removeItem('pendingUser');
          this.router.navigate(['/otp-complete']);
        },
        error: (err) => {
          this.loading = false;
          alert(err.error.message || 'OTP verification failed');
        }
      });
    } else {
      alert('Please complete all 6 digits');
    }
  }
}
