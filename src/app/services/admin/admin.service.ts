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

  // Utility method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Book Management
  getAllBooks(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.baseUrl}/bookmang`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookmang/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add a specific method for getting books by slug
  getBookBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookmang/slug/${slug}`, {
      headers: this.getAuthHeaders()
    });
  }

  createBook(bookData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookmang`, bookData, {
      headers: this.getAuthHeaders()
    });
  }

  updateBook(id: string, bookData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/bookmang/${id}`, bookData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/bookmang/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // User Management
  getAllUsers(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.baseUrl}/admin/users`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users`, userData, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/users/${id}`, userData, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Order Management
  getAllOrders(page: number = 1, limit: number = 10, status?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get(`${this.baseUrl}/admin/orders`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/orders/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/orders/${id}/status`, { status }, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/orders/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Category Management
  getAllCategories(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.baseUrl}/categories`, {
      params: params
    });
  }

  getCategoryById(idOrSlug: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log('🔍 Getting category by ID/slug:', idOrSlug);
    console.log('🔑 Token being sent:', token);
    
    return this.http.get(`${this.baseUrl}/categories/${idOrSlug}`, {
      headers: this.getAuthHeaders()
    });
  }

  createCategory(categoryData: any): Observable<any> {
    // Get token directly to ensure consistency
    const token = localStorage.getItem('authToken');

    // Make sure the token is properly formatted with 'Bearer ' prefix
    const authHeader = token ? (!token.startsWith('Bearer ') ? `Bearer ${token}` : token) : '';

    // Create headers object once with all required headers
    const headers = new HttpHeaders({
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    });

    console.log('📦 Token being sent:', headers.get('Authorization')); // 🔍 Debug

    return this.http.post(`${this.baseUrl}/categories`, categoryData, {
      headers: headers
    });
  }

  updateCategory(idOrSlug: string, categoryData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${idOrSlug}`, categoryData, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  deleteCategory(idOrSlug: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${idOrSlug}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Review Management
  getAllReviews(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.baseUrl}/admin/reviews`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getReviewById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/reviews/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateReviewStatus(id: string, isApproved: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/reviews/${id}/status`, { isApproved }, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/reviews/${id}`, {
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
    return this.http.get(`${this.baseUrl}/admin/bestsellers`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get recent orders
  getRecentOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/orders/recent`, {
      headers: this.getAuthHeaders()
    });
  }
}
