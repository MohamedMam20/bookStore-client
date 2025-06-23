import { Component } from '@angular/core';
import { CartSideMenuComponent } from '../cart-side-menu/cart-side-menu.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CartSideMenuComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isCartMenuOpen = false;

  toggleCartMenu() {
    this.isCartMenuOpen = !this.isCartMenuOpen;
  }
}

//https://bookly-theme.myshopify.com/
