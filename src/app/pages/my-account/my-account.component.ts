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

  updateShippingAddress() {
    this.isLoading = true;
    this.userService.updateShippingAddress(this.shippingAddress).subscribe({
      next: (response) => {
        this.billingMessage = 'Shipping address updated successfully!';
        this.isLoading = false;
        this.editingShippingAddress = false;
        this.addNotification(this.billingMessage);
        setTimeout(() => this.billingMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.billingMessage = 'Failed to update shipping address';
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

  removePaymentMethod(id: string) {
    this.userService.removePaymentMethod(id).subscribe({
      next: (response) => {
        this.paymentMethods = this.paymentMethods.filter(pm => pm._id !== id);
        this.addNotification('Payment method removed!');
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to remove payment method');
      }
    });
  }

  setDefaultPaymentMethod(id: string) {
    this.userService.setDefaultPaymentMethod(id).subscribe({
      next: (response) => {
        this.paymentMethods.forEach(pm => pm.isDefault = pm._id === id);
        this.addNotification('Default payment method updated!');
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to update default payment method');
      }
    });
  }

  removeFromCart(id: string) {
    this.userService.removeFromCart(id).subscribe({
      next: (response) => {
        this.cartItems = this.cartItems.filter(item => item._id !== id);
        this.addNotification('Item removed from cart!');
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to remove item from cart');
      }
    });
  }

  removeFromWishlist(id: string) {
    this.userService.removeFromWishlist(id).subscribe({
      next: (response) => {
        this.wishlist = this.wishlist.filter(item => item.bookId !== id);
        this.addNotification('Item removed from wishlist!');
      },
      error: (err) => {
        console.error(err);
        this.addNotification('Failed to remove item from wishlist');
      }
    });
  }

  moveToCart(id: string) {
    const item = this.wishlist.find(w => w.bookId === id);
    if (item) {
      this.userService.addToCart({
        bookId: id,
        quantity: 1,
        language: item.language || 'English'
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
        bookId: item.book._id,
        quantity: item.quantity
      })),
      shippingAddress: this.shippingAddress,
      paymentMethodId: this.paymentMethods.find(pm => pm.isDefault)?._id
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

  deleteReview(reviewId: string) {
    this.isLoading = true;
    this.userService.deleteReview(reviewId).subscribe({
      next: (response) => {
        this.reviews = this.reviews.filter(review => review._id !== reviewId);
        this.isLoading = false;
        this.addNotification('Review deleted successfully!');
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.addNotification('Failed to delete review');
      }
    });
  }

  getSelectedOrder(): Order | null {
    if (!this.selectedOrderId) return null;
    return this.orders.find(order => order._id === this.selectedOrderId) || null;
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
