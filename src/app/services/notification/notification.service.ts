import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from '../Sockets/socket.service';
import { Notification } from '../../models/notification.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

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
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.loadNotificationsFromStorage();
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    // Listen for new order notifications
    this.socketService.listen('newOrderNotification').subscribe((data) => {
      // Store books data but don't show in message
      let booksList = [];
      if (data.books && Array.isArray(data.books) && data.books.length > 0) {
        booksList = data.books.map((book: any) => {
          return {
            title: book.title || 'Unknown Book',
            quantity: book.quantity || 1,
            price: book.price || 0
          };
        });
      }

      // Format price if available
      const totalAmount = data.totalAmount || 0;
      const priceInfo = `Total: $${totalAmount}`;

      // Get email - check multiple possible locations
      let email = 'unknown@email.com';
      if (data.user && data.user.email) {
        email = data.user.email;
      }

      // Format username - check multiple possible locations for user info
      let firstName = '', lastName = '';
      if (data.userName && data.userName !== 'undefined undefined') {
        const nameParts = data.userName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.length > 1 ? nameParts[1] : '';
      } else if (data.user) {
        firstName = data.user.name || data.user.firstName || '';
        lastName = data.user.lastName || '';
      }
      
      const userName = firstName && lastName ? `${firstName} ${lastName}` : 
                      firstName ? firstName : 'a customer';

      // Create simplified notification message with just order ID, email and price
      const message = `New order received. Email: ${email}. ${priceInfo}`;

      // Check for duplicate notifications before adding
      const existingNotifications = this.notifications.value;
      const isDuplicate = existingNotifications.some(n => 
        n.data && n.data.orderId === data.orderId
      );

      if (!isDuplicate) {
        this.addNotification({
          id: this.generateId(),
          message: message,
          type: 'order',
          read: false,
          createdAt: new Date(),
          data: {
            orderId: data.orderId,
            books: booksList,
            totalAmount: totalAmount,
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email
          }
        });

        // Show toast notification for admins
        if (this.authService.currentUser?.role === 'admin') {
          this.toastr.success(message);
        }
      }
    });
    
    // Listen for test notifications
    this.socketService.listen('testNotification').subscribe((data) => {
      // Only show test notifications in development environment
      if (!environment.production && this.authService.currentUser?.role === 'admin') {
        this.toastr.info('Test notification received', 'Test');
        this.addNotification({
          id: this.generateId(),
          message: 'This is a test notification',
          type: 'system',
          read: false,
          createdAt: new Date(),
          data: data
        });
      }
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
        // Silent error handling
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
