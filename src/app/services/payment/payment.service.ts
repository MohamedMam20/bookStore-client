import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private baseUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    if (!token) {
      throw new Error('No auth token found');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  createCheckout(data: {
    productId?: string;
    quantity?: number;
    amount?: number;
    cartItems?: { productId: string; quantity: number; language: string }[];
    language?: string;
  }): Observable<{ clientSecret: string; orderId: string }> {
    return this.http
      .post<{ clientSecret: string; orderId: string }>(
        `${this.baseUrl}/checkout`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Checkout error:', error);
          return throwError(
            () => new Error('Failed to create checkout session')
          );
        })
      );
  }

  confirmPayment(data: {
    paymentIntentId: string;
    orderId: string;
    mode?: 'cart' | 'buyNow';
  }): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${this.baseUrl}/checkout/confirm`, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Payment confirmation error:', error);
          return throwError(() => new Error('Payment confirmation failed'));
        })
      );
  }
  loadStripe(): Promise<{ stripe: any; elements: any }> {
    return new Promise((resolve, reject) => {
      if ((window as any).Stripe) {
        const stripe = (window as any).Stripe(environment.STRIPE_PUBLIC_KEY);
        const elements = stripe.elements();
        resolve({ stripe, elements });
      } else {
        reject('Stripe.js not loaded');
      }
    });
  }
  cancelOrder(orderId: string) {
    return this.http.post(`${this.baseUrl}/cancel`, { orderId });
  }
}
