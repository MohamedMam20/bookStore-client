import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

// Define interfaces for API responses
interface ApiResponse<T> {
  status: string;
  data: T;
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  billingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethods?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}`;

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
    // Use forkJoin to combine multiple API calls
    return forkJoin({
      userProfile: this.http.get<ApiResponse<UserProfileData>>(`${this.baseUrl}/users/myprofile`, { headers: this.getAuthHeaders() }),
      orders: this.getUserOrders(),
      cart: this.getUserCart(),
      wishlist: this.getUserWishlist(),
      reviews: this.getUserReviews()
    }).pipe(
      map(results => {
        const { userProfile, orders, cart, wishlist, reviews } = results;
        return {
          userInfo: {
            name: `${userProfile.data.firstName || ''} ${userProfile.data.lastName || ''}`.trim(),
            email: userProfile.data.email,
            firstName: userProfile.data.firstName,
            lastName: userProfile.data.lastName,
            phone: userProfile.data.phone || ''
          },
          orders: orders.data || [],
          cartItems: cart.data?.items || [],
          wishlist: wishlist.data || [],
          reviews: reviews.data || [],
          billingAddress: userProfile.data.billingAddress || {
            fullName: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          shippingAddress: userProfile.data.shippingAddress || {
            fullName: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          paymentMethods: userProfile.data.paymentMethods || []
        };
      })
    );
  }

  // Update user profile information
  updateUserProfile(userData: any): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.baseUrl}/users/myprofile`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // Change user password
  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Observable<ApiResponse<any>> {
    const data = {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };
    return this.http.patch<ApiResponse<any>>(`${this.baseUrl}/users/myprofile`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user orders
  getUserOrders(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/orders/history`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get order details
  getOrderDetails(orderId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/orders/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user cart
  getUserCart(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/cart`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add item to cart
  addToCart(bookData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/cart/add`, bookData, {
      headers: this.getAuthHeaders()
    });
  }

  // Remove item from cart
  removeFromCart(itemId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/cart?bookId=${itemId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Clear cart
  clearCart(): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/cart/clear`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user wishlist
  getUserWishlist(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/wishlist/view`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add to wishlist
  addToWishlist(bookId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/wishlist/add`, { bookId }, {
      headers: this.getAuthHeaders()
    });
  }

  // Remove from wishlist
  removeFromWishlist(bookId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/wishlist/remove?bookId=${bookId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user reviews
  getUserReviews(): Observable<ApiResponse<any[]>> {
    // There's no specific endpoint for user reviews, so we'll need to get all reviews
    // and filter by user on the frontend
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/reviews`, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete a user review
  deleteReview(reviewId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/reviews/${reviewId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update billing address
  updateBillingAddress(addressData: any): Observable<ApiResponse<any>> {
    // Include the address data in the profile update
    return this.http.patch<ApiResponse<any>>(`${this.baseUrl}/users/myprofile`, {
      billingAddress: addressData
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // Update shipping address
  updateShippingAddress(addressData: any): Observable<ApiResponse<any>> {
    // Include the address data in the profile update
    return this.http.patch<ApiResponse<any>>(`${this.baseUrl}/users/myprofile`, {
      shippingAddress: addressData
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // Add payment method
  addPaymentMethod(paymentData: any): Observable<ApiResponse<any>> {
    // Include the payment method in the profile update
    return this.http.patch<ApiResponse<any>>(`${this.baseUrl}/users/myprofile`, {
      paymentMethod: paymentData
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // Remove payment method
  removePaymentMethod(paymentId: string): Observable<ApiResponse<any>> {
    // We need to update the user profile to remove a payment method
    // This would require getting the current profile first, then updating it
    return this.http.patch<ApiResponse<any>>(`${this.baseUrl}/users/myprofile`, {
      removePaymentMethod: paymentId
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // Set default payment method
  setDefaultPaymentMethod(paymentId: string): Observable<ApiResponse<any>> {
    // Update the user profile to set a default payment method
    return this.http.patch<ApiResponse<any>>(`${this.baseUrl}/users/myprofile`, {
      defaultPaymentMethod: paymentId
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // Place order
  placeOrder(orderData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/orders/place-order`, orderData, {
      headers: this.getAuthHeaders()
    });
  }
}
