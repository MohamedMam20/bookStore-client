import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = 'http://localhost:3000/api/v1/reviews'; // غيريها لو عندك API مختلف

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
