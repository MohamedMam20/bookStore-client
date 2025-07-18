import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from '../../services/user/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderHistoryComponent } from '../order-history/order-history.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, OrderHistoryComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  form!: FormGroup;

  isLoading = true;      

  constructor(
    private fb: FormBuilder,
    private userSrv: UserProfileService,
    private toast: ToastrService
  ) {}

userName: string = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      oldPassword: [''],
      newPassword: [''],
    });

    this.userSrv.getMyProfile().subscribe({
      next: ({ data }) => {
        this.isLoading = false;
      const user: UserProfile = data;
    this.userName = `${user.firstName} ${user.lastName ?? ''}`.trim();

        this.form.patchValue({
          firstName: data.firstName,
          lastName: data.lastName ?? '',
        });
      },
      error: (e) => {
        this.isLoading = false;
        this.toast.error(e.error?.message || 'Failed to load profile');
      },
    });
  }

onSubmit(): void {
  if (this.form.invalid) {
    this.toast.warning('⚠️ Please fill all required fields correctly.');
    return;
  }

  const payload = { ...this.form.value };

  if (!payload.newPassword?.trim()) {
    delete payload.newPassword;
    delete payload.oldPassword;
  }

  this.userSrv.updateMyProfile(payload).subscribe({
    next: (res) => {
      this.toast.success(res.message || '✅ Profile updated successfully!');
      this.form.patchValue({
        firstName: res.data?.firstName ?? '',
        lastName: res.data?.lastName ?? '',
      });
    },
    error: (err) => {

      const backendMsg = err?.error?.message || '❌ Update failed.';

      this.toast.error(backendMsg);
    },
  });
}

}

