// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private http = inject(HttpClient);
//   private baseUrl = `${environment.apiUrl}/cart`;



//   addToCart(bookData: {
//     bookId: string;
//     quantity: number;
//     language: string;
//   }): Observable<any> {
//     return this.http.post(`${this.baseUrl}/add`, bookData);
//   }

//   viewCart(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/`);
//   }

//   deleteItem(id: string): Observable<any> {
//     return this.http.delete(`${this.baseUrl}`, {
//       body: { id },
//     });
//   }
//   updateItemQuantity(itemId: string, quantity: number) {
//     return this.http.patch<any>(`${this.baseUrl}/update-quantity`, {
//       id: itemId,
//       quantity,
//     });
//   }
//   clearCart(): Observable<any> {
//   return this.http.delete(`${this.baseUrl}/clear`);
// }

// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/cart`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }

  addToCart(bookData: { bookId: string; quantity: number; language: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, bookData, { headers: this.getHeaders() });
  }

  viewCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`, { headers: this.getHeaders() });
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}`, { headers: this.getHeaders(), body: { id } });
  }

  updateItemQuantity(itemId: string, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/update-quantity`, { id: itemId, quantity }, { headers: this.getHeaders() });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear`, { headers: this.getHeaders() });
  }
}
