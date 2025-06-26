import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private baseUrl = 'http://localhost:3000/api/v1/otp';

  constructor(private http: HttpClient) {}

  verifyOTP(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-otp`, data);
  }
}
