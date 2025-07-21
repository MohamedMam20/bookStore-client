import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from '../Sockets/socket.service';
import { Notification } from '../../models/notification.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable();

  constructor(
    private socketService: SocketService,
    private toastr: ToastrService
  ) {
    this.loadNotificationsFromStorage();
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    // Listen for new order notifications
    this.socketService.listenToNewOrders().subscribe((data) => {
      
      // Create notification object with enhanced data
      const notification: Notification = {
        id: this.generateId(),
        message: `New order placed by ${data.userName}`,
        type: 'order',
        read: false,
        createdAt: new Date(),
        data: { 
          orderId: data.orderId,
          email: data.user?.email || 'unknown',
          totalAmount: data.totalAmount || 0,
          books: data.books || []
        }
      };
      
      // Add to notification system
      this.addNotification(notification);
      
      // Show toast notification
      this.toastr.success(`New order placed by ${data.userName || 'a customer'}`, 'New Order');
    });
  }

  private loadNotificationsFromStorage(): void {
    const savedNotifications = localStorage.getItem('admin-notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const notifications = parsedNotifications.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        this.notifications.next(notifications);
        this.updateUnreadCount();
      } catch (e) {
        console.error('Error parsing saved notifications', e);
      }
    }
  }

  private saveNotificationsToStorage(): void {
    localStorage.setItem('admin-notifications', JSON.stringify(this.notifications.value));
  }

  private updateUnreadCount(): void {
    const count = this.notifications.value.filter(n => !n.read).length;
    this.unreadCount.next(count);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }

  addNotification(notification: Notification): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notifications.next(updatedNotifications);
    this.saveNotificationsToStorage();
    this.updateUnreadCount();
  }

  markAsRead(id: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications.next(updatedNotifications);
    this.saveNotificationsToStorage();
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notifications.next(updatedNotifications);
    this.saveNotificationsToStorage();
    this.updateUnreadCount();
  }

  clearNotifications(): void {
    this.notifications.next([]);
    this.saveNotificationsToStorage();
    this.updateUnreadCount();
  }
}
