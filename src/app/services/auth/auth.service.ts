import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/v1/auth';

  constructor(private http: HttpClient) {}

  // Registration
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Request Password Reset OTP
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/requestPasswordReset`, { email });
  }

  // Confirm Password Reset
  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resetPassword`, {
      email,
      otp,
      newPassword
    });
  }
}
