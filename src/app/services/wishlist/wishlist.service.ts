// wishlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface WishlistResponse {
  data: any[];
  message: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = `${environment.apiUrl}/wishlist`;
  private wishlistIdsSubject = new BehaviorSubject<string[]>([]);
  wishlistIds$ = this.wishlistIdsSubject.asObservable();
  
  // Add count subject
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load initial wishlist data if user is logged in
    this.loadWishlistData();
  }
  
  // Load wishlist data when the service initializes or after login
  loadWishlistData(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('Loading wishlist data - user is authenticated');
      this.viewWishlist().subscribe({
        next: response => {
          console.log('Wishlist data loaded successfully:', response);
        },
        error: error => {
          console.error('Failed to load wishlist data:', error);
        }
      });
    } else {
      console.log('User not authenticated - no wishlist data to load');
      this.wishlistIdsSubject.next([]);
      this.wishlistCountSubject.next(0);
    }
  }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  viewWishlist(): Observable<WishlistResponse> {
    console.log('Wishlist Service - Viewing wishlist');
    
    if (!localStorage.getItem('authToken')) {
      console.log('Cannot view wishlist: User not authenticated');
      return of({ data: [], message: 'Not authenticated', status: 'error' } as WishlistResponse);
    }
    
    return this.http.get<WishlistResponse>(`${this.baseUrl}/view`, { headers: this.getHeaders() }).pipe(
      tap((res) => {
        console.log('Wishlist Service - View wishlist success:', res);
        const ids = res.data?.map((item: any) => item.bookId) || [];
        this.wishlistIdsSubject.next(ids);
        this.wishlistCountSubject.next(ids.length);
      }),
      catchError(error => {
        console.error('Wishlist Service - View wishlist error:', error);
        this.wishlistIdsSubject.next([]);
        this.wishlistCountSubject.next(0);
        return of({ data: [], message: error.message, status: 'error' } as WishlistResponse);
      })
    );
  }

  addToWishlist(payload: { bookId: string; language?: string }): Observable<any> {
    console.log('Wishlist Service - Adding to wishlist:', payload);
    
    if (!localStorage.getItem('authToken')) {
      console.error('Cannot add to wishlist: User not authenticated');
      return of({ error: 'Not authenticated' });
    }
    
    return this.http.post<any>(`${this.baseUrl}/add`, payload, { headers: this.getHeaders() }).pipe(
      tap((response) => {
        console.log('Wishlist Service - Add to wishlist success:', response);
        const current = this.wishlistIdsSubject.getValue();
        if (!current.includes(payload.bookId)) {
          const newIds = [...current, payload.bookId];
          this.wishlistIdsSubject.next(newIds);
          this.wishlistCountSubject.next(newIds.length);
        }
      }),
      catchError(error => {
        console.error('Wishlist Service - Add to wishlist error:', error);
        throw error;
      })
    );
  }

  deleteItem(wishlistItemId: string): Observable<any> {
    console.log('Wishlist Service - Deleting from wishlist:', wishlistItemId);
    
    if (!localStorage.getItem('authToken')) {
      console.error('Cannot delete from wishlist: User not authenticated');
      return of({ error: 'Not authenticated' });
    }
    
    return this.http.request('delete', `${this.baseUrl}/remove`, {
      headers: this.getHeaders(),
      body: { id: wishlistItemId },
    }).pipe(
      tap((response) => {
        console.log('Wishlist Service - Delete from wishlist success:', response);
        const current = this.wishlistIdsSubject.getValue();
        const newIds = current.filter(id => id !== wishlistItemId);
        this.wishlistIdsSubject.next(newIds);
        this.wishlistCountSubject.next(newIds.length);
      }),
      catchError(error => {
        console.error('Wishlist Service - Delete from wishlist error:', error);
        throw error;
      })
    );
  }

  getWishlistIds(): string[] {
    return this.wishlistIdsSubject.getValue();
  }

  setWishlistIds(ids: string[]): void {
    this.wishlistIdsSubject.next(ids);
    this.wishlistCountSubject.next(ids.length);
  }
  
  // Get current wishlist count
  getWishlistCount(): number {
    return this.wishlistCountSubject.getValue();
  }
}
