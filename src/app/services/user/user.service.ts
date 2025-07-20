import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';

// Define interfaces for API responses
interface ApiResponse<T> {
  status: string;
  data: T;
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all user dashboard data in one call
  getUserDashboardData(): Observable<{
    userInfo: {
      firstName: string;
      lastName: string;
      name: string;
      email: string;
    };
  }> {
    return this.http.get<ApiResponse<UserProfileData>>(
      `${this.baseUrl}/users/myprofile`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        const data = response.data;
        return {
          userInfo: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim()
          }
        };
      })
    );
  }


  // Change user password
  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Observable<ApiResponse<any>> {
    const data = {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };
    return this.http.patch<ApiResponse<any>>(
      `${this.baseUrl}/users/myprofile`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

}
