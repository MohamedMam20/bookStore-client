import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = `${environment.apiUrl}/review`;

  constructor(private http: HttpClient) {}

  getBookReviews(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${slug}`, this.getAuthHeader());
  }

  submitReview(slug: string, data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${slug}`,
      data,
      this.getAuthHeader()
    );
  }

  updateReview(slug: string, data: any): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/${slug}`,
      data,
      this.getAuthHeader()
    );
  }

  deleteReview(slug: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${slug}`, this.getAuthHeader());
  }

  private getAuthHeader() {
    const token = localStorage.getItem('authToken'); // عدلي لو بتحطي التوكن في مكان تاني
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
