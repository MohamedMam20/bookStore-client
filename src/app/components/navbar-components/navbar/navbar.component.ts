import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartSideMenuComponent } from '../cart-side-menu/cart-side-menu.component';
import { RouterLink } from '@angular/router';
import { SearchMenuComponent } from '../search-menu/search-menu.component';
import { CommonModule } from '@angular/common';
import { ToggleMenuComponent } from '../toggle-menu/toggle-menu.component';
import { AuthService } from '../../../services/auth/auth.service';
import { SearchServiceService } from '../../../services/search/search-service.service';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { WishlistService } from '../../../services/wishlist/wishlist.service';
import { Subscription } from 'rxjs';

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
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount: number = 0;
  wishlistCount: number = 0;
  private cartSubscription!: Subscription;
  private wishlistSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private searchService: SearchServiceService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {
    // Subscribe immediately to catch any early cart/wishlist updates
    this.subscribeToCartAndWishlist();
  }

  ngOnInit(): void {
    // Check initial login state and load data if logged in
    if (this.loggedIn) {
      console.log('Navbar: User is logged in, fetching cart and wishlist data');
      this.cartService.loadCartData(); // This is a new method we added to the service
      this.wishlistService.viewWishlist().subscribe();
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  private subscribeToCartAndWishlist(): void {
    // Subscribe to cart and wishlist count observables
    this.cartSubscription = this.cartService.cartItemsCount$.subscribe(count => {
      console.log('Navbar: Cart count updated to', count);
      this.cartCount = count;
    });
    
    this.wishlistSubscription = this.wishlistService.wishlistCount$.subscribe(count => {
      console.log('Navbar: Wishlist count updated to', count);
      this.wishlistCount = count;
    });
  }

  get loggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  onLogout() {
    // Reset counts when logging out
    this.cartCount = 0;
    this.wishlistCount = 0;
    this.authService.logout();
  }
  
  isCartMenuOpen = false;
  isSearchMenuOpen = false;
  isToggleMenuOpen = false;

  toggleCartMenu() {
    this.isCartMenuOpen = !this.isCartMenuOpen;
    if (this.isCartMenuOpen && this.loggedIn) {
      // Refresh cart data when opening cart menu
      console.log('Navbar: Refreshing cart data');
      this.cartService.viewCart().subscribe();
    }
  }
  
  toggleSearchMenu() {
    this.isSearchMenuOpen = !this.isSearchMenuOpen;
  }

  toggleMenu() {
    this.isToggleMenuOpen = !this.isToggleMenuOpen;
  }
}

//https://bookly-theme.myshopify.com/
