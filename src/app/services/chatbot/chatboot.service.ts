import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ChatbootService {
  private apiUrl = `${environment.apiUrl}/chatbot`; // API URL

  constructor(private http: HttpClient) {}

  getAIResponse(message: string): Observable<any> {
    const body = { message };
    return this.http.post<any>(this.apiUrl, body);
  }
}
