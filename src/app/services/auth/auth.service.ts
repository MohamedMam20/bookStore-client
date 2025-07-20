import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/v1/auth';



  constructor(private http: HttpClient, private router: Router, private toaster: ToastrService) {}

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
      this.toaster.success('Logged out successfully');

  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  googleLogin(token: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/googleLogin`, { token });
}

  


decodeToken(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
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
}
