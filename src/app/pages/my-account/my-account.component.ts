import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';

interface Order {
  _id: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  shippingAddress: any;
  paymentMethod: string;
}

interface OrderItem {
  book: any;
  quantity: number;
  price: number;
}

interface CartItem {
  _id: string;
  book: any;
  quantity: number;
  price: number;
}

interface WishlistItem {
  _id: string;
  bookId: string;
  title: string;
  price: number;
  image?: string;
  language: string;
}

interface Review {
  _id: string;
  book: any;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

interface BillingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  _id: string;
  type: string;
  cardNumber: string;
  expiryDate: string;
  cardHolder: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MyAccountComponent implements OnInit {
  constructor(private userService: UserService) {}

  selectedSection: string = 'dashboard';
  selectedOrderId: string | null = null;
  showPasswordChange: boolean = false;
  showAddressForm: boolean = false;
  showPaymentForm: boolean = false;
  editingShippingAddress: boolean = false;

  isLoading: boolean = false;
  notifications: string[] = [];

  // Dynamic Data
  orders: Order[] = [];
  cartItems: CartItem[] = [];
  wishlist: WishlistItem[] = [];
  reviews: Review[] = [];

  userInfo = {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };



  paymentMethods: PaymentMethod[] = [];

  newPaymentMethod = {
    type: 'Visa',
    cardNumber: '',
    expiryDate: '',
    cardHolder: '',
    cvv: ''
  };

  userInfoMessage = '';
  billingMessage = '';
  paymentMessage = '';

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading = true;
    this.userService.getUserDashboardData().subscribe({
      next: (data) => {
        this.userInfo = {
          ...this.userInfo,
          ...data.userInfo,
          name: `${data.userInfo.firstName || ''} ${data.userInfo.lastName || ''}`.trim()
        };
        this.orders = data.orders;
        this.cartItems = data.cartItems;
        this.wishlist = data.wishlist;
        this.reviews = data.reviews;

        this.paymentMethods = data.paymentMethods;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  selectSection(section: string) {
    this.selectedSection = section;
    this.selectedOrderId = null;
    this.showPasswordChange = false;
    this.showAddressForm = false;
    this.showPaymentForm = false;
    this.editingShippingAddress = false;
  }

  viewOrderDetails(orderId: string) {
    this.selectedOrderId = orderId;
    this.selectedSection = 'order-details';
  }

  updateUserInfo() {
    this.isLoading = true;

    const userData = {
      firstName: this.userInfo.firstName,
      lastName: this.userInfo.lastName,
      phone: this.userInfo.phone
    };

    this.userService.updateUserProfile(userData).subscribe({
      next: (response) => {
        this.userInfoMessage = 'Profile updated successfully!';
        this.isLoading = false;
        // Update the display name
        this.userInfo.name = `${this.userInfo.firstName || ''} ${this.userInfo.lastName || ''}`.trim();
        setTimeout(() => this.userInfoMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.userInfoMessage = 'Failed to update profile';
        this.isLoading = false;
        setTimeout(() => this.userInfoMessage = '', 3000);
      }
    });
  }

  // Add validation error messages
  validationErrors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  changePassword() {
    // Reset validation errors
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



