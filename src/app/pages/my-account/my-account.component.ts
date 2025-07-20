import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MyAccountComponent implements OnInit {
  constructor(private userService: UserService) {}

  showPasswordChange: boolean = false;
  isLoading: boolean = false;
  userInfoMessage = '';


  userInfo = {
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  validationErrors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading = true;
    this.userService.getUserDashboardData().subscribe({
      next: (data) => {
        this.userInfo.firstName = data.userInfo.firstName;
        this.userInfo.lastName = data.userInfo.lastName;
        this.userInfo.email = data.userInfo.email;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  changePassword() {
    this.validationErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Validate current password
    if (!this.userInfo.currentPassword) {
      this.validationErrors.currentPassword = 'Current password is required';
      return;
    }

    // Validate new password
    if (!this.userInfo.newPassword) {
      this.validationErrors.newPassword = 'New password is required';
      return;
    } else if (this.userInfo.newPassword.length < 8 || this.userInfo.newPassword.length > 16) {
      this.validationErrors.newPassword = 'Password must be between 8-16 characters';
      return;
    } else if (!/(?=.*[a-z])/.test(this.userInfo.newPassword)) {
      this.validationErrors.newPassword = 'Password must contain at least one lowercase letter';
      return;
    } else if (!/(?=.*[A-Z])/.test(this.userInfo.newPassword)) {
      this.validationErrors.newPassword = 'Password must contain at least one uppercase letter';
      return;
    } else if (!/(?=.*\d)/.test(this.userInfo.newPassword)) {
      this.validationErrors.newPassword = 'Password must contain at least one number';
      return;
    } else if (!/(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>\/?])/.test(this.userInfo.newPassword)) {
      this.validationErrors.newPassword = 'Password must contain at least one special character';
      return;
    }

    // Validate confirm password
    if (!this.userInfo.confirmPassword) {
      this.validationErrors.confirmPassword = 'Please confirm your password';
      return;
    } else if (this.userInfo.newPassword !== this.userInfo.confirmPassword) {
      this.validationErrors.confirmPassword = 'Passwords do not match!';
      return;
    }

    this.isLoading = true;

    // Define the passwordData object before using it
    const passwordData = {
      currentPassword: this.userInfo.currentPassword,
      newPassword: this.userInfo.newPassword
    };

    this.userService.changePassword(passwordData).subscribe({
      next: (response) => {
        this.userInfoMessage = 'Password changed successfully!';
        this.isLoading = false;
        this.showPasswordChange = false;
        this.userInfo.currentPassword = '';
        this.userInfo.newPassword = '';
        this.userInfo.confirmPassword = '';
        setTimeout(() => this.userInfoMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        if (err.status === 401) {
          this.validationErrors.currentPassword = 'Current password is incorrect';
        } else {
          this.userInfoMessage = 'Failed to change password';
        }
        this.isLoading = false;
        setTimeout(() => this.userInfoMessage = '', 3000);
      }
    });
  }

}



