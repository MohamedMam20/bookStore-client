import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../services/notification/notification.service';
import { Notification } from '../../../../models/notification.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
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
  
  viewOrder(orderId: string): void {
    // Mark the notification as read
    const notification = this.notifications.find(n => n.data?.orderId === orderId);
    if (notification) {
      this.notificationService.markAsRead(notification.id);
    }
    
    // Navigate to the order details page
    this.router.navigate(['/admin/orders', orderId]);
    
    // Close the notification panel
    this.close.emit();
  }
}
