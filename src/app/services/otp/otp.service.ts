import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private baseUrl = `${environment.apiUrl}/otp`;

  constructor(private http: HttpClient) {}

  verifyOTP(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-otp`, data);
  }
}
