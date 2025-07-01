import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../../models/book.model';
@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private apiUrl = 'http://localhost:3000/api/v1/book';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }
}
