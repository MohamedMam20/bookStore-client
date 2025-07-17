// wishlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = `${environment.apiUrl}/wishlist`;
  private wishlistIdsSubject = new BehaviorSubject<string[]>([]);
  wishlistIds$ = this.wishlistIdsSubject.asObservable();

  constructor(private http: HttpClient) {}

  viewWishlist() {
    return this.http.get<any>(`${this.baseUrl}/view`).pipe(
      tap((res) => {
        const ids = res.data?.map((item: any) => item.bookId) || [];
        this.wishlistIdsSubject.next(ids);
      })
    );
  }

  addToWishlist(payload: { bookId: string; language?: string }) {
    return this.http.post<any>(`${this.baseUrl}/add`, payload).pipe(
      tap(() => {
        const current = this.wishlistIdsSubject.getValue();
        if (!current.includes(payload.bookId)) {
          this.wishlistIdsSubject.next([...current, payload.bookId]);
        }
      })
    );
  }

  deleteItem(wishlistItemId: string) {
    return this.http.request('delete', `${this.baseUrl}/remove`, {
      body: { id: wishlistItemId },
    });
  }

  getWishlistIds() {
    return this.wishlistIdsSubject.getValue();
  }

  setWishlistIds(ids: string[]) {
    this.wishlistIdsSubject.next(ids);
  }
}
