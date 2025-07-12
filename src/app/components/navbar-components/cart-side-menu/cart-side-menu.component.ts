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
@Component({
  selector: 'app-cart-side-menu',
  standalone: true,
  imports: [CommonModule,RouterModule ],
  templateUrl: './cart-side-menu.component.html',
  styleUrl: './cart-side-menu.component.css',
})
export class CartSideMenuComponent implements OnChanges {
  @Input() isCartVisible = false;
  @Output() closed = new EventEmitter<boolean>();

  cartItems: any[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
    private orderService: OrderService
  ) {}
  paypalLoading = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['isCartVisible']?.currentValue === true) {
      this.loadCart();
    }
  }

  loadCart() {
    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cartItems = res.data || [];
        console.log(res.data);
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

    if (newQuantity > item.book?.stock?.[item.language]) {
      this.toastr.warning(
        `Only ${item.book.stock[item.language]} items in stock.`
      );
      return;
    }

    this.cartService.updateItemQuantity(item.id, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to update quantity.');
      },
    });
  }

  decreaseQuantity(item: any): void {
    const newQuantity = item.quantity - 1;

    if (newQuantity <= 0) {
      this.removeFromCart(item.id);
      return;
    }

    this.cartService.updateItemQuantity(item.id, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to update quantity.');
      },
    });
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

// proceedToPurchase() {
//   if (!this.cartItems.length) {
//     this.toastr.warning('Cart is empty!');
//     return;
//   }

//   const cartItems = this.cartItems.map((item) => ({
//     productId: item.book?._id || item.productId,
//     title: item.book?.title || item.title,
//     price: item.price,
//     quantity: item.quantity,
//     image: item.book?.image || item.image || '',
//     language: item.language || 'ar',
//   }));

//   this.router.navigate(['/checkout'], {
//     state: {
//       mode: 'cart',
//       cartItems
//     }
//   });
// }
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
    state: { mode: 'cart' }
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
          window.location.href = res.approvalUrl; // redirect to PayPal
        },
        error: (err) => {
          this.toastr.error('Failed to create PayPal order');
          this.paypalLoading = false;
        }
      });
    },
    error: (err) => {
      this.toastr.error('Failed to place order');
      this.paypalLoading = false;
    }
  });
}
}
