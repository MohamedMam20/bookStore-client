import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../services/cart/cart.service';
@Component({
  selector: 'app-cart-side-menu',
  standalone: true,
  imports: [CommonModule],
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
    private toastr: ToastrService
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
        console.log(res.data);
      },
      error: (err) => {
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

    const maxStock = item.book?.stock?.[item.language];
    if (maxStock !== undefined && newQuantity > maxStock) {
      this.toastr.warning(`Only ${maxStock} items in stock.`);
      return;
    }

    this.cartService.updateItemQuantity(item.id, newQuantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to update quantity.');
      },
    });
  }

  decreaseQuantity(item: any): void {
    const newQuantity = item.quantity - 1;

    this.cartService.updateItemQuantity(item.id, newQuantity).subscribe({
      next: () => {
        this.loadCart();
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

  proceedToPurchase() {
    this.router.navigateByUrl('/checkout');
    this.isCartVisible = false;
  }
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10) || 1;
      return total + price * quantity;
    }, 0);
  }
}
