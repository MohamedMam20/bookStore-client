import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Filter {
  label: string;
  value: string;
}

export interface BookResponse {
  status: string;
  data: any[];
  totalPages?: number;
  totalItems?: number;
}

@Injectable({ providedIn: 'root' })
export class FilterService {
  private filtersSubject = new BehaviorSubject<Filter[]>([]);
  filters$ = this.filtersSubject.asObservable();
  private baseUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  get filters(): Filter[] {
    return this.filtersSubject.value;
  }

  addFilter(filter: Filter) {
    if (
      !this.filters.find(
        (f) => f.label === filter.label && f.value === filter.value
      )
    ) {
      this.filtersSubject.next([...this.filters, filter]);
    }
  }

  removeFilter(filter: Filter) {
    this.filtersSubject.next(
      this.filters.filter(
        (f) => !(f.label === filter.label && f.value === filter.value)
      )
    );
  }

  clearFilters() {
    this.filtersSubject.next([]);
  }

  /**
   * Get filtered books from API
   */
  getFilteredBooks(): Observable<BookResponse> {
    const params = this.buildFilterParams(this.filters);

    console.log('Filter Service - Getting filtered books with params:', params);
    return this.http.get<BookResponse>(`${this.baseUrl}`, { params });
  }

  /**
   * Get sorted and filtered books from API with pagination support
   */
  getSortedAndFilteredBooks(
    sortValue: string,
    filters: Filter[],
    page: number = 1,
    limit: number = 6
  ): Observable<BookResponse> {
    const params = this.buildFilterParams(filters);

    if (sortValue) {
      params.sort = sortValue;
    }

    params.page = page.toString();
    params.limit = limit.toString();

    console.log('Filter Service - Getting sorted and filtered books with params:', params);
    return this.http.get<BookResponse>(`${this.baseUrl}`, { params });
  }

  /**
   * Build filter parameters from a given set of filters
   */
  private buildFilterParams(filters: Filter[]): any {
    const params: any = {};

    filters.forEach(filter => {
      const key = filter.label.toLowerCase();

      switch (key) {
        case 'price':
          const priceRange = filter.value.match(/LE\s*(\d+)\s*-\s*LE\s*(\d+)/);
          if (priceRange) {
            params.priceMin = priceRange[1];
            params.priceMax = priceRange[2];
          }
          break;

        case 'genre':
          if (params.genre) {
            params.genre = Array.isArray(params.genre)
              ? [...params.genre, filter.value]
              : [params.genre, filter.value];
          } else {
            params.genre = filter.value;
          }
          break;

        case 'language':
          if (params.language) {
            params.language = Array.isArray(params.language)
              ? [...params.language, filter.value]
              : [params.language, filter.value];
          } else {
            params.language = filter.value;
          }
          break;

        default:
          params[key] = filter.value;
      }
    });

    return params;
  }
}
