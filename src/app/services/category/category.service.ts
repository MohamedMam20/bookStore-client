import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;
  private categoriesCache: Category[] = [];
  private categoriesLoaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Get all categories
   */
  getAllCategories(): Observable<Category[]> {
    // Return cached categories if available
    if (this.categoriesLoaded) {
      return of(this.categoriesCache);
    }

    return this.http.get<any>(this.baseUrl).pipe(
      map((response) => {
        return response.data || [];
      }),
      tap((categories) => {
        // Store categories in cache
        this.categoriesCache = categories;
        this.categoriesLoaded = true;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  /**
   * Get all categories without pagination (for filter component)
   */
  getAllCategoriesWithoutPagination(): Observable<Category[]> {
    // Return cached categories if available
    if (this.categoriesLoaded) {
      return of(this.categoriesCache);
    }

    return this.http
      .get<any>(`${this.baseUrl}?limit=100`) // Set a high limit to get all categories
      .pipe(
        map((response) => {
          return response.data || [];
        }),
        tap((categories) => {
          // Store categories in cache
          this.categoriesCache = categories;
          this.categoriesLoaded = true;
        }),
        catchError((error) => {
          return of([]);
        })
      );
  }

  /**
   * Force refresh categories from the server
   */
  refreshCategories(): Observable<Category[]> {
    this.categoriesLoaded = false;
    return this.getAllCategoriesWithoutPagination();
  }

  /**
   * Get a specific category by ID
   */
  getCategoryById(id: string): Observable<Category> {
    // Check cache first
    const cachedCategory = this.categoriesCache.find((cat) => cat._id === id);
    if (cachedCategory) {
      return of(cachedCategory);
    }

    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  /**
   * Get a specific category by slug
   */
  getCategoryBySlug(slug: string): Observable<Category> {
    // Check cache first
    const cachedCategory = this.categoriesCache.find(
      (cat) => cat.slug === slug
    );
    if (cachedCategory) {
      return of(cachedCategory);
    }

    return this.http.get<any>(`${this.baseUrl}/slug/${slug}`).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}
