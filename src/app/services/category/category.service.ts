import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Get all categories
   */
  getAllCategories(): Observable<Category[]> {
    console.log('Category Service - Fetching all categories');
    return this.http.get<any>(this.baseUrl)
      .pipe(
        map(response => {
          console.log('Category Service - Categories fetched:', response);
          return response.data || [];
        })
      );
  }

  /**
   * Get all categories without pagination (for filter component)
   */
  getAllCategoriesWithoutPagination(): Observable<Category[]> {
    console.log('Category Service - Fetching all categories without pagination');
    return this.http.get<any>(`${this.baseUrl}?limit=100`) // Set a high limit to get all categories
      .pipe(
        map(response => {
          console.log('Category Service - All categories fetched:', response);
          return response.data || [];
        })
      );
  }

  /**
   * Get a specific category by ID
   */
  getCategoryById(id: string): Observable<Category> {
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
