import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service'; // adjust path

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  author: string;
}

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  author: string;
  image?: string;
}

interface Review {
  id: number;
  product: string;
  rating: number;
  comment: string;
  date: string;
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
  id: number;
  type: string;
  last4: string;
  expiryDate: string;
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
  selectedOrderId: number | null = null;
  showPasswordChange: boolean = false;
  showAddressForm: boolean = false;
  showPaymentForm: boolean = false;

  isLoading: boolean = false;
  notifications: string[] = [];

  // Dynamic Data
  orders: Order[] = [];
  cartItems: CartItem[] = [];
  wishlist: WishlistItem[] = [];
  reviews: Review[] = [];

  userInfo = {
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  billingAddress: BillingAddress = {
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

  shippingAddress: BillingAddress = {
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

  paymentMethods: PaymentMethod[] = [];

  newPaymentMethod = {
    type: 'Visa',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
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
        this.userInfo = { ...this.userInfo, ...data.userInfo };
        this.orders = data.orders;
        this.cartItems = data.cartItems;
        this.wishlist = data.wishlist;
        this.reviews = data.reviews;
        this.billingAddress = data.billingAddress;
        this.shippingAddress = data.shippingAddress;
        this.paymentMethods = data.paymentMethods;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to load dashboard data');
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
  }

  viewOrderDetails(orderId: number) {
    this.selectedOrderId = orderId;
    this.selectedSection = 'order-details';
  }

  updateUserInfo() {
    this.isLoading = true;
    this.userService.updateUserProfile(this.userInfo).subscribe({
      next: (response) => {
        this.userInfoMessage = 'Profile updated successfully!';
        this.isLoading = false;
        this.addNotification(this.userInfoMessage);
        setTimeout(() => this.userInfoMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.userInfoMessage = 'Failed to update profile';
        this.isLoading = false;
        this.addNotification(this.userInfoMessage);
        setTimeout(() => this.userInfoMessage = '', 3000);
      }
    });
  }

  changePassword() {
    if (this.userInfo.newPassword !== this.userInfo.confirmPassword) {
      this.userInfoMessage = 'Passwords do not match!';
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
        this.addNotification(this.userInfoMessage);
        setTimeout(() => this.userInfoMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.userInfoMessage = 'Failed to change password';
        this.isLoading = false;
        this.addNotification(this.userInfoMessage);
        setTimeout(() => this.userInfoMessage = '', 3000);
      }
    });
  }

  updateBillingAddress() {
    this.isLoading = true;
    this.userService.updateBillingAddress(this.billingAddress).subscribe({
      next: (response) => {
        this.billingMessage = 'Billing address updated successfully!';
        this.isLoading = false;
        this.showAddressForm = false;
        this.addNotification(this.billingMessage);
        setTimeout(() => this.billingMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.billingMessage = 'Failed to update billing address';
        this.isLoading = false;
        this.addNotification(this.billingMessage);
        setTimeout(() => this.billingMessage = '', 3000);
      }
    });
  }

  addPaymentMethod() {
    this.isLoading = true;
    this.userService.addPaymentMethod(this.newPaymentMethod).subscribe({
      next: (response) => {
        this.paymentMessage = 'Payment method added successfully!';
        this.isLoading = false;
        this.showPaymentForm = false;
        this.newPaymentMethod = { type: 'Visa', cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' };
        this.addNotification(this.paymentMessage);
        this.fetchDashboardData(); // Refresh payment methods
        setTimeout(() => this.paymentMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.paymentMessage = 'Failed to add payment method';
        this.isLoading = false;
        this.addNotification(this.paymentMessage);
        setTimeout(() => this.paymentMessage = '', 3000);
      }
    });
  }

  removePaymentMethod(id: number) {
    this.userService.removePaymentMethod(id.toString()).subscribe({
      next: (response) => {
        this.paymentMethods = this.paymentMethods.filter(pm => pm.id !== id);
        this.addNotification('Payment method removed!');
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to remove payment method');
      }
    });
  }

  setDefaultPaymentMethod(id: number) {
    this.userService.setDefaultPaymentMethod(id.toString()).subscribe({
      next: (response) => {
        this.paymentMethods.forEach(pm => pm.isDefault = pm.id === id);
        this.addNotification('Default payment method updated!');
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to update default payment method');
      }
    });
  }

  removeFromCart(id: number) {
    this.userService.removeFromCart(id.toString()).subscribe({
      next: (response) => {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.addNotification('Item removed from cart!');
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to remove item from cart');
      }
    });
  }

  removeFromWishlist(id: number) {
    this.userService.removeFromWishlist(id.toString()).subscribe({
      next: (response) => {
        this.wishlist = this.wishlist.filter(item => item.id !== id);
        this.addNotification('Item removed from wishlist!');
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to remove item from wishlist');
      }
    });
  }

  moveToCart(id: number) {
    const item = this.wishlist.find(w => w.id === id);
    if (item) {
      this.userService.addToCart({
        bookId: id.toString(),
        quantity: 1,
        language: 'English' // Default language, adjust as needed
      }).subscribe({
        next: (response) => {
          this.removeFromWishlist(id);
          this.fetchDashboardData(); // Refresh cart items
          this.addNotification('Item moved to cart!');
        },
        error: (err) => {
          console.error(err);
          this.addNotification('Failed to move item to cart');
        }
      });
    }
  }

  placeOrder() {
    this.isLoading = true;

    const orderData = {
      items: this.cartItems.map(item => ({
        bookId: item.id.toString(),
        quantity: item.quantity
      })),
      shippingAddress: this.shippingAddress,
      paymentMethodId: this.paymentMethods.find(pm => pm.isDefault)?.id.toString()
    };

    this.userService.placeOrder(orderData).subscribe({
      next: (response) => {
        this.cartItems = [];
        this.isLoading = false;
        this.addNotification('Order placed successfully!');
        this.selectSection('orders');
        this.fetchDashboardData(); // Refresh orders
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.addNotification('Failed to place order');
      }
    });
  }

  getSelectedOrder(): Order | null {
    return this.orders.find(order => order.id === this.selectedOrderId) || null;
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getStarsArray(rating: number): { filled: boolean }[] {
    return Array(5).fill(0).map((_, i) => ({ filled: i < rating }));
  }

  addNotification(message: string) {
    this.notifications.push(message);
    setTimeout(() => {
      this.notifications = this.notifications.filter(n => n !== message);
    }, 4000);
  }

  dismissNotification(message: string) {
    this.notifications = this.notifications.filter(n => n !== message);
  }
}
