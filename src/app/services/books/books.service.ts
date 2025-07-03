import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private apiUrl = 'http://localhost:3000/api/v1/book';

  constructor(private http: HttpClient) {}

  getBooks(
    page: number = 1,
    limit: number = 6
  ): Observable<{
    books: Book[];
    totalPages: number;
    totalItems: number;
  }> {
    let params = new HttpParams()
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
      }>(this.apiUrl, { params })
      .pipe(
        map((response) => ({
          books: response.data,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        }))
      );
  }
 getBookById(slug: string): Observable<Book> {
  return this.http.get<Book>(`http://localhost:3000/api/v1/book/${slug}`);
}

}

