import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/paypal/order.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
  standalone: true,
  imports: [],
})
export class PayComponent implements OnInit {
  cartItems: any[] = [];
  paypalLoading = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cartItems = res.data || [];
      },
      error: () => {
        this.toastr.error('Failed to load cart');
      },
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10) || 1;
      return total + price * quantity;
    }, 0);
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

  startPaypal() {
    this.paypalLoading = true;

    this.orderService.placeOrder().subscribe({
      next: (order) => {
        this.orderService.createPaypal(order.data._id).subscribe({
          next: (res) => {
            window.location.href = res.approvalUrl;
          },
          error: () => {
            this.toastr.error('Failed to create PayPal order');
            this.paypalLoading = false;
          },
        });
      },
      error: () => {
        this.toastr.error('Failed to place order');
        this.paypalLoading = false;
      },
    });
  }
}
