import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  private selectedSortSubject = new BehaviorSubject<string>('');
  selectedSort$ = this.selectedSortSubject.asObservable();

  constructor(private http: HttpClient) {}

  setSortOption(sortValue: string) {
    this.selectedSortSubject.next(sortValue);
  }

  getSortedBooks(sortValue: string) {
    const url = `http://localhost:3000/api/v1/book?sort=${sortValue}`;
    return this.http.get<any>(url);
  }
}
