import { Component } from '@angular/core';
import { CartSideMenuComponent } from '../cart-side-menu/cart-side-menu.component';
import { RouterLink } from '@angular/router';
import { SearchMenuComponent } from '../search-menu/search-menu.component';
import { CommonModule } from '@angular/common';
import { ToggleMenuComponent } from '../toggle-menu/toggle-menu.component';
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
  isCartMenuOpen = false;
  isSearchMenuOpen = false;
  isToggleMenuOpen = false;
  categories = [
    {
      title: 'Adventures',
      image:
        'https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg',
    },
    {
      title: 'Eating & Books for a Cause',
      image:
        'https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg',
    },
    {
      title: 'Fresh Healthy Meats',
      image:
        'https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg',
    },
    {
      title: 'Endless Summer',
      image:
        'https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg',
    },
  ];

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
