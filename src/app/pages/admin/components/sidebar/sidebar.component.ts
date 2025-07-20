import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('expandCollapse', [
      state('void', style({ height: '0', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
    ])
  ]
})
export class AdminSidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Input() isMobile = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  userInfo = {
    firstName: '',
    lastName: '',
    email: '',
  };

  collapsedSections: { [key: string]: boolean } = {
    content: false,
    orders: false,
    users: false,
    settings: false
  };

  menuItems = [
    { route: '/admin/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', section: 'main' },
    { route: '/admin/books', icon: 'fas fa-book', label: 'Books', section: 'content' },
    { route: '/admin/categories', icon: 'fas fa-tags', label: 'Categories', section: 'content' },
    { route: '/admin/orders', icon: 'fas fa-shopping-cart', label: 'Orders', section: 'orders' },
    { route: '/admin/users', icon: 'fas fa-users', label: 'Regular Users', section: 'users' },
    { route: '/admin/admins', icon: 'fas fa-user-shield', label: 'Admins', section: 'users' },
    { route: '/admin/reviews', icon: 'fas fa-star', label: 'Reviews', section: 'main' },
    { route: '/admin/settings', icon: 'fas fa-cog', label: 'Settings', section: 'settings' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Load any saved collapsed section states
    const savedSections = localStorage.getItem('admin-collapsed-sections');
    if (savedSections) {
      try {
        this.collapsedSections = JSON.parse(savedSections);
      } catch (e) {
        console.error('Error parsing saved section states', e);
      }
    }

    // Fetch user data
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.userService.getUserDashboardData().subscribe({
      next: (data) => {
        this.userInfo.firstName = data.userInfo.firstName;
        this.userInfo.lastName = data.userInfo.lastName;
        this.userInfo.email = data.userInfo.email;
      },
    });
  }

  toggleSection(section: string): void {
    if (!this.collapsed) {
      this.collapsedSections[section] = !this.collapsedSections[section];
      this.saveSectionStates();
    }
  }

  saveSectionStates(): void {
    localStorage.setItem('admin-collapsed-sections', JSON.stringify(this.collapsedSections));
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
