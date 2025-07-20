import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
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
      console.log('Category Service - Returning cached categories');
      return of(this.categoriesCache);
    }

    console.log('Category Service - Fetching all categories');
    return this.http.get<any>(this.baseUrl)
      .pipe(
        map(response => {
          console.log('Category Service - Categories fetched:', response);
          return response.data || [];
        }),
        tap(categories => {
          // Store categories in cache
          this.categoriesCache = categories;
          this.categoriesLoaded = true;
        }),
        catchError(error => {
          console.error('Error fetching categories:', error);
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
      console.log('Category Service - Returning cached categories (without pagination)');
      return of(this.categoriesCache);
    }

    console.log('Category Service - Fetching all categories without pagination');
    return this.http.get<any>(`${this.baseUrl}?limit=100`) // Set a high limit to get all categories
      .pipe(
        map(response => {
          console.log('Category Service - All categories fetched:', response);
          return response.data || [];
        }),
        tap(categories => {
          // Store categories in cache
          this.categoriesCache = categories;
          this.categoriesLoaded = true;
        }),
        catchError(error => {
          console.error('Error fetching all categories:', error);
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
    const cachedCategory = this.categoriesCache.find(cat => cat._id === id);
    if (cachedCategory) {
      console.log(`Category Service - Returning cached category with id: ${id}`);
      return of(cachedCategory);
    }

    console.log(`Category Service - Fetching category with id: ${id}`);
    return this.http.get<any>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => {
          console.log('Category Service - Category fetched:', response);
          return response.data;
        })
      );
  }

  /**
   * Get a specific category by slug
   */
  getCategoryBySlug(slug: string): Observable<Category> {
    // Check cache first
    const cachedCategory = this.categoriesCache.find(cat => cat.slug === slug);
    if (cachedCategory) {
      console.log(`Category Service - Returning cached category with slug: ${slug}`);
      return of(cachedCategory);
    }

    console.log(`Category Service - Fetching category with slug: ${slug}`);
    return this.http.get<any>(`${this.baseUrl}/slug/${slug}`)
      .pipe(
        map(response => {
          console.log('Category Service - Category fetched:', response);
          return response.data;
        })
      );
  }
}
