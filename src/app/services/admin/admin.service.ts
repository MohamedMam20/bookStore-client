import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Book } from '../../models/book.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Book Management with pagination
  getAllBooks(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.baseUrl}/bookmang`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  createBook(bookData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookmang`, bookData, {
      headers: this.getAuthHeaders()
    });
  }

  updateBook(id: string, bookData: any): Observable<any> {
    // If bookData is FormData, don't modify headers
    if (bookData instanceof FormData) {
      const headers = this.getAuthHeaders();
      // Don't set Content-Type for FormData as the browser will set it with the boundary
      return this.http.put(`${this.baseUrl}/bookmang/${id}`, bookData, {
        headers: headers
      });
    } else {
      // If it's a regular object, convert to JSON
      return this.http.put(`${this.baseUrl}/bookmang/${id}`, bookData, {
        headers: this.getAuthHeaders().set('Content-Type', 'application/json')
      });
    }
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/bookmang/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // User Management with pagination
  getAllUsers(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.baseUrl}/admin`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin`, userData, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/${id}`, userData, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Dashboard Statistics
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/stats`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get bestselling books
  getBestsellers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookmang/bestsellers`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get recent orders
  getRecentOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/recent`, {
      headers: this.getAuthHeaders()
    });
  }
}
