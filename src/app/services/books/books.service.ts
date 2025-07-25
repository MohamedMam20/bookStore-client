import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../../models/book.model';
import { Filter } from '../filter/filter-state.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/books`;
  private bestSellerUrl = `${this.baseUrl}/bestsellers`;
  constructor(private http: HttpClient) {}

  getBooks(
    page: number = 1,
    limit: number = 6,
    sort?: string,
    filters?: Filter[]
  ): Observable<{
    books: Book[];
    totalPages: number;
    totalItems: number;
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Add sort parameter if provided
    if (sort) {
      params = params.set('sort', sort);
    }

    // In the getBooks method, update the filter processing section:

    // Process filters
    if (filters && filters.length > 0) {
      // Group filters by label (case-insensitive comparison)
      const genreFilters = filters
        .filter((f) => f.label.toLowerCase() === 'genre')
        .map((f) => f.value);
      const languageFilters = filters
        .filter((f) => f.label.toLowerCase() === 'language')
        .map((f) => f.value);
      const priceFilters = filters.filter(
        (f) => f.label.toLowerCase() === 'price'
      );

      // Add genre filters
      if (genreFilters.length > 0) {
        genreFilters.forEach((genre) => {
          params = params.append('genre', genre);
        });
      }

      // Add language filters
      if (languageFilters.length > 0) {
        languageFilters.forEach((language) => {
          params = params.append('language', language);
        });
      }

      // Process price filters
      if (priceFilters.length > 0) {
        // Extract min and max values from price ranges like "LE 100 - LE 200"
        let minPrice = Number.MAX_SAFE_INTEGER;
        let maxPrice = 0;

        priceFilters.forEach((filter) => {
          const priceRange = filter.value;
          const matches = priceRange.match(/LE (\d+) - LE (\d+)/);

          if (matches && matches.length === 3) {
            const min = parseInt(matches[1]);
            const max = parseInt(matches[2]);

            if (min < minPrice) minPrice = min;
            if (max > maxPrice) maxPrice = max;
          }
        });

        if (minPrice !== Number.MAX_SAFE_INTEGER) {
          params = params.set('priceMin', minPrice.toString());
        }

        if (maxPrice > 0) {
          params = params.set('priceMax', maxPrice.toString());
        }
      }
    }

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
    return this.http.get<Book>(`${this.apiUrl}/${slug}`);
  }

  //=============== best sellers ================
  // getBestSellers(): Observable<Book[]> {
  //   return this.http
  //     .get<{ status: string; data: Book[] }>(this.bestSellerUrl)
  //     .pipe(map((res) => res.data));
  // }
}
