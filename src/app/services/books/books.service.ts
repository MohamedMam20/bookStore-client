import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private apiUrl = 'http://localhost:3000/api/v1/book';

  constructor(private http: HttpClient) {}

  getBooks(after?: string, limit: number = 6): Observable<Book[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (after) {
      params = params.set('after', after);
    }

    return this.http.get<Book[]>(this.apiUrl, { params });
  }
}
