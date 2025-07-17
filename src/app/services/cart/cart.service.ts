import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CartResponse {
  data: {
    items: any[];
    [key: string]: any;
  };
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/cart`;

  // Add a BehaviorSubject to track cart items count
  private cartItemsCountSubject = new BehaviorSubject<number>(0);
  cartItemsCount$ = this.cartItemsCountSubject.asObservable();

  constructor() {
    // Load initial cart data if user is logged in
    this.loadCartData();
  }

  // Load cart data when the service initializes or after login
  loadCartData(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('Loading cart data - user is authenticated');
      this.viewCart().subscribe({
        next: response => {
          console.log('Cart data loaded successfully:', response);
        },
        error: error => {
          console.error('Failed to load cart data:', error);
        }
      });
    } else {
      console.log('User not authenticated - no cart data to load');
      this.cartItemsCountSubject.next(0);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  viewCart(): Observable<CartResponse> {
    console.log('Cart Service - Viewing cart');

    if (!localStorage.getItem('authToken')) {
      console.log('Cannot view cart: User not authenticated');
      return of({ data: { items: [] } } as CartResponse);
    }

    return this.http.get<any>(`${this.baseUrl}/`, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          console.log('Cart Service - View cart success:', response);
          // Update the cart items count
          const itemsCount = Array.isArray(response.data) ? response.data.length : 0;
          console.log(`Cart Service - Updating cart count to: ${itemsCount}`);
          this.cartItemsCountSubject.next(itemsCount);
        }),
        catchError(error => {
          console.error('Cart Service - View cart error:', error);
          this.cartItemsCountSubject.next(0);
          return of({ data: { items: [] } } as CartResponse);
        })
      );
  }

  addToCart(bookData: { bookId: string; quantity: number; language: string }): Observable<any> {
    console.log('Cart Service - Adding to cart:', bookData);

    if (!localStorage.getItem('authToken')) {
      console.error('Cannot add to cart: User not authenticated');
      return of({ error: 'Not authenticated' });
    }

    return this.http.post(`${this.baseUrl}/add`, bookData, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          console.log('Cart Service - Add to cart success:', response);
          // After adding to cart, refresh the cart to get updated count
          this.viewCart().subscribe();
        }),
        catchError(error => {
          console.error('Cart Service - Add to cart error:', error);
          throw error;
        })
      );
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}`, { headers: this.getHeaders(), body: { id } })
      .pipe(
        tap(response => {
          console.log('Cart Service - Delete item success:', response);
          // After deleting an item, refresh the cart to get updated count
          this.viewCart().subscribe();
        }),
        catchError(error => {
          console.error('Cart Service - Delete item error:', error);
          throw error;
        })
      );
  }

  updateItemQuantity(itemId: string, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/update-quantity`, { id: itemId, quantity }, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          console.log('Cart Service - Update quantity success:', response);
          // After updating quantity, no need to update count as item count doesn't change
        }),
        catchError(error => {
          console.error('Cart Service - Update quantity error:', error);
          throw error;
        })
      );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear`, { headers: this.getHeaders() })
      .pipe(
        tap(response => {
          console.log('Cart Service - Clear cart success:', response);
          // After clearing cart, update count to 0
          this.cartItemsCountSubject.next(0);
        }),
        catchError(error => {
          console.error('Cart Service - Clear cart error:', error);
          throw error;
        })
      );
  }

  // Method to get the current cart count
  getCartItemsCount(): number {
    return this.cartItemsCountSubject.getValue();
  }
}
