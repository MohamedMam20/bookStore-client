import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-side-menu.component.html',
  styleUrl: './cart-side-menu.component.css',
})
export class CartSideMenuComponent {
  constructor(private router: Router) {}
  @Input() isCartVisible = false;
  @Output() closed = new EventEmitter<boolean>();

  cartItems = [];

  closeCart() {
    this.closed.emit();
  }
  continueShopping() {
    this.router.navigateByUrl('/');
  }
  login() {}
  checkout() {}
}
