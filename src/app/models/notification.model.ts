export interface Notification {
  id: string;
  message: string;
  type: 'order' | 'review' | 'user' | 'system';
  read: boolean;
  createdAt: Date;
  data?: any; // Additional data like orderId, userId, etc.
}
