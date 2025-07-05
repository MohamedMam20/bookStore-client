import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Book } from '../../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class SearchServiceService {
  private searchResultsSubject = new BehaviorSubject<Book[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(private http: HttpClient) {}

  searchBooks(
    keyword: string,
    page: number = 1,
    limit: number = 6
  ): Observable<{
    books: Book[];
    totalPages: number;
    totalItems: number;
  }> {
    const params = new HttpParams()
      .set('search', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get<{
        status: string;
        page: number;
        totalPages: number;
        totalItems: number;
        results: number;
        data: Book[];
      }>(`${environment.apiUrl}/v1/books`, { params })
      .pipe(
        map((response) => ({
          books: response.data,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        }))
      );
  }

  setResults(results: Book[]) {
    this.searchResultsSubject.next(results);
  }

  getCurrentResults(): Book[] {
    return this.searchResultsSubject.value;
  }
}
