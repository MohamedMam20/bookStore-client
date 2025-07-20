import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  //socket
  get currentUser(): any | null {
  return this.getCurrentUser();
}

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
  resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/resetPassword`, {
      email,
      otp,
      newPassword,
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Google Login
  googleLogin(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/googleLogin`, { token });
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role === 'admin';
    } catch {
      return false;
    }
  }
  getCurrentUser(): any | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }
}
