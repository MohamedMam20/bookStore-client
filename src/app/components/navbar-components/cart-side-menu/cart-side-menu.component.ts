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
        this.cartItems = res.items || [];
        console.log(res);
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
}
