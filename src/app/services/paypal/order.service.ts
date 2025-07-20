import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
const API = environment.apiUrl;

export interface PlaceOrderResponse {
  status: string;
  message: string;
  data: {
    //  ←  this is the field name
    _id: string;
    totalPrice: number;
    status: 'pending' | 'delivered' | string;
  };
}
export interface OrderHistoryItem {
  id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  books: {
    title: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  placeOrder() {
    return this.http.post<PlaceOrderResponse>(
      `${API}/orders/place-order`,
      {},
      { headers: this.auth() }
    );
  }

  createPaypal(orderId: string) {
    return this.http.post<any>(
      `${API}/paypal/create`,
      { orderId },
      { headers: this.auth() }
    );
  }

  capturePaypal(token: string) {
    return this.http.get<any>(`${API}/paypal/capture?token=${token}`);
  }

  //   getHistory(): Observable<{ data: OrderHistoryItem[] }> {
  //   return this.http.get<{ data: OrderHistoryItem[] }>(
  //     `${API}/orders/history`,
  //     { headers: this.auth() }
  //   );
  // }

  getHistory(
    page: number = 1,
    limit: number = 10
  ): Observable<{
    data: OrderHistoryItem[];
    totalPages: number;
    totalOrders: number;
    page: number;
    limit: number;
    count: number;
    status: string;
  }> {
    return this.http.get<{
      data: OrderHistoryItem[];
      totalPages: number;
      totalOrders: number;
      page: number;
      limit: number;
      count: number;
      status: string;
    }>(`${API}/orders/history?page=${page}&limit=${limit}`, {
      headers: this.auth(),
    });
  }

  private auth() {
    const token = localStorage.getItem('authToken') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
