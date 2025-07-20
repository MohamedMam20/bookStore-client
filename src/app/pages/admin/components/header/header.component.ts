import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { Notification } from '../../../../models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  @Input() isMobile = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleNotifications = new EventEmitter<void>();

  userInfo = {
    firstName: '',
    lastName: '',
    email: '',
  };

  notifications: Notification[] = [];
  unreadCount = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();

    // Subscribe to notifications
    this.subscriptions.push(
      this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications.slice(0, 5); // Show only the 5 most recent
      })
    );

    // Subscribe to unread count
    this.subscriptions.push(
      this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onToggleNotifications(): void {
    this.toggleNotifications.emit();
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
  }

  viewAllNotifications(): void {
    this.onToggleNotifications();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
