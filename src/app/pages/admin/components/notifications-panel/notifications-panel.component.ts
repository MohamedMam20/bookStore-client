import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../../services/notification/notification.service';
import { Notification } from '../../../../models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.css']
})
export class NotificationsPanelComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  notifications: Notification[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closePanel(): void {
    this.close.emit();
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  clearAll(): void {
    this.notificationService.clearNotifications();
  }
  
  viewOrderDetails(notification: Notification): void {
    if (notification.data?.orderId) {
      // Mark as read when viewing details
      this.notificationService.markAsRead(notification.id);
      
      // Close the panel
      this.closePanel();
      
      // Navigate to order details page
      this.router.navigate(['/admin/orders', notification.data.orderId]);
    }
  }
}
