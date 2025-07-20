import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';



import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;



  constructor(private http: HttpClient, private router: Router, private toaster: ToastrService) {}

  //auth for socket to know that the user is admin
  get currentUser(): any {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user || null;
    } catch (err) {
      return null;
    }
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
