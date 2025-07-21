import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../services/cart/cart.service';
import { OrderService } from '../../../services/paypal/order.service';
import { AuthService } from '../../../services/auth/auth.service';
@Component({
  selector: 'app-cart-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-side-menu.component.html',
  styleUrl: './cart-side-menu.component.css',
})
export class CartSideMenuComponent implements OnChanges {
  @Input() isCartVisible = false;
  @Output() closed = new EventEmitter<boolean>();

  cartItems: any[] = [];
  paypalLoading = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isCartVisible']?.currentValue === true) {
      this.loadCart();
    }
  }

  loadCart() {
    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cartItems = res.data || [];
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to load cart');
        this.cartItems = [];
      },
    });
  }

  closeCart() {
    this.closed.emit();
  }

  continueShopping() {
    this.isCartVisible = false;
    this.router.navigateByUrl('/');
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  checkout() {
    if (!this.cartItems.length) {
      this.toastr.warning('Cart is empty!');
      return;
    }
    this.router.navigateByUrl('/checkout');
  }

  increaseQuantity(item: any): void {
    const newQuantity = item.quantity + 1;
    const availableStock = item.stock;

    if (newQuantity > availableStock) {
      this.toastr.warning(`Only ${availableStock} items in stock.`);
      return;
    }

    item.quantity = newQuantity;
  }

  decreaseQuantity(item: any): void {
    const newQuantity = item.quantity - 1;

    if (newQuantity <= 0) {
      this.removeFromCart(item.id);
      return;
    }

    item.quantity = newQuantity;
  }

  removeFromCart(itemId: string): void {
    this.cartService.deleteItem(itemId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        console.error('Delete failed:', err);
      },
    });
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  proceedToPurchase() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.toastr.error('Please log in to proceed with checkout');
      this.router.navigateByUrl('/login', { state: { returnUrl: '/cart' } });
      return;
    }

    if (!this.cartItems.length) {
      this.toastr.warning('Cart is empty!');
      return;
    }

    this.router.navigate(['/checkout'], {
      queryParams: { mode: 'cart' },
      state: { mode: 'cart' },
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10) || 1;
      return total + price * quantity;
    }, 0);
  }

  startPaypal() {
    this.paypalLoading = true;

    this.orderService.placeOrder().subscribe({
      next: (order) => {
        this.orderService.createPaypal(order.data._id).subscribe({
          next: (res) => {
            window.location.href = res.approvalUrl;
          },
          error: (err) => {
            this.toastr.error('Failed to create PayPal order');
            this.paypalLoading = false;
          },
        });
      },
      error: (err) => {
        this.toastr.error('Failed to place order');
        this.paypalLoading = false;
      },
    });
  }

goToPayment() {
  this.router.navigate(['/payment']);
}


}
