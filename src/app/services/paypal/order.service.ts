import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000/api/v1';

export interface PlaceOrderResponse {
  status:  string;
  message: string;
  data: {                 //  ←  this is the field name
    _id:        string;
    totalPrice: number;
    status:     'pending' | 'delivered' | string;
  };
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

private auth() {
  const token = localStorage.getItem('authToken') || '';
  return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}
}
