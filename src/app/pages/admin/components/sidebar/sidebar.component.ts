import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class AdminSidebarComponent {
  menuItems = [
    { icon: 'fa-dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'fa-book', label: 'Books', route: '/admin/books' },
    { icon: 'fa-shopping-cart', label: 'Orders', route: '/admin/orders' },
    { icon: 'fa-users', label: 'Users', route: '/admin/users' },
    { icon: 'fa-star', label: 'Reviews', route: '/admin/reviews' },
    { icon: 'fa-cog', label: 'Settings', route: '/admin/settings' }
  ];
}
