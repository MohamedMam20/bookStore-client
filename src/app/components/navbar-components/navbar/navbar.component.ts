import { Component } from '@angular/core';
import { CartSideMenuComponent } from '../cart-side-menu/cart-side-menu.component';
import { RouterLink } from '@angular/router';
import { SearchMenuComponent } from '../search-menu/search-menu.component';
import { CommonModule } from '@angular/common';
import { ToggleMenuComponent } from '../toggle-menu/toggle-menu.component';
import { AuthService } from '../../../services/auth/auth.service';
import { SearchServiceService } from '../../../services/search/search-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CartSideMenuComponent,
    RouterLink,
    SearchMenuComponent,
    CommonModule,
    ToggleMenuComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private searchService: SearchServiceService,
    private router: Router
  ) {}

  get loggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onLogout() {
    this.authService.logout();
  }
  isCartMenuOpen = false;
  isSearchMenuOpen = false;
  isToggleMenuOpen = false;

  toggleCartMenu() {
    this.isCartMenuOpen = !this.isCartMenuOpen;
  }
  toggleSearchMenu() {
    this.isSearchMenuOpen = !this.isSearchMenuOpen;
  }

  toggleMenu() {
    this.isToggleMenuOpen = !this.isToggleMenuOpen;
  }
}

//https://bookly-theme.myshopify.com/
