import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) {}

//auth for socket to know that the user is admin
get currentUser(): any {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user || null;
  }catch (err){
    return null;
  }
}
//narimannn
// get isAdminser():boolean {
//   return this.currentUser?.role ==='admin';
// }


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
