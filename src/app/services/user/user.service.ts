import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  updateMyProfile(value: any) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = `${environment.apiUrl}/v1`;

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all user dashboard data in one call
  getUserDashboardData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/myprofile`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update user profile information
  updateUserProfile(userData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/myprofile`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // Change user password
  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/myprofile`, passwordData, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user orders
  getUserOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get order details
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user cart
  getUserCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add item to cart
  addToCart(bookData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, bookData, {
      headers: this.getAuthHeaders()
    });
  }

  // Remove item from cart
  removeFromCart(itemId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart?bookId=${itemId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Clear cart
  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/clear`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user wishlist
  getUserWishlist(): Observable<any> {
    return this.http.get(`${this.baseUrl}/wishlist`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add to wishlist
  addToWishlist(bookId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { bookId }, {
      headers: this.getAuthHeaders()
    });
  }

  // Remove from wishlist
  removeFromWishlist(bookId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wishlist/${bookId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user reviews
  getUserReviews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/review/user`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update billing address
  updateBillingAddress(addressData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/address/billing`, addressData, {
      headers: this.getAuthHeaders()
    });
  }

  // Update shipping address
  updateShippingAddress(addressData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/address/shipping`, addressData, {
      headers: this.getAuthHeaders()
    });
  }

  // Add payment method
  addPaymentMethod(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/payment-methods`, paymentData, {
      headers: this.getAuthHeaders()
    });
  }

  // Remove payment method
  removePaymentMethod(paymentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/payment-methods/${paymentId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Set default payment method
  setDefaultPaymentMethod(paymentId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/payment-methods/${paymentId}/default`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Place order
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, orderData, {
      headers: this.getAuthHeaders()
    });
  }
}
