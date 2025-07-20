import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BookResponse } from '../filter/filter-state.service';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  private selectedSortSubject = new BehaviorSubject<string>('');
  selectedSort$ = this.selectedSortSubject.asObservable();
  private baseUrl = `${environment.apiUrl}/books`; // Changed from 'book' to 'books'

  constructor(private http: HttpClient) {}

  /**
   * Set the current sort option
   */
  setSortOption(sortValue: string): void {
    this.selectedSortSubject.next(sortValue);
  }

  /**
   * Get the current sort option
   */
  getCurrentSortOption(): string {
    return this.selectedSortSubject.getValue();
  }

  /**
   * Get books sorted by the specified option
   */
  getSortedBooks(sortValue: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.baseUrl}`, {
      params: { sort: sortValue },
    });
  }
}
