import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-side-menu.component.html',
  styleUrl: './cart-side-menu.component.css',
})
export class CartSideMenuComponent {
  @Input() isVisible = false;
  @Output() closed = new EventEmitter<boolean>();

  cartItems = [];

  close() {
    this.closed.emit();
  }
  continueShopping() {}
  login() {}
  checkout() {}
}
