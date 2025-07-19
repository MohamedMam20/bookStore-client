// src/app/services/user/user-profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../../models/user-profile.model';

const API = 'http://localhost:3000/api/v1/users';

function auth() {
  const token = localStorage.getItem('authToken') ?? '';
  return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<{ data: UserProfile }> {
    return this.http.get<{ data: UserProfile }>(`${API}/myprofile`, { headers: auth() });
  }

  // updateMyProfile(payload: any): Observable<{ data: UserProfile,  }> {
  //   return this.http.patch<{ data: UserProfile }>(`${API}/myprofile`, payload, { headers: auth() });
  // }
  updateMyProfile(payload: any): Observable<{ message: string; data: UserProfile; status: string }> {
  return this.http.patch<{ message: string; data: UserProfile; status: string }>(
    `${API}/myprofile`,
    payload,
    { headers: auth() }
  );
}

}