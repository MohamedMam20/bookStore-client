import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbootService {
  private apiUrl = 'http://localhost:3000/chatbot'; // API URL

  constructor(private http: HttpClient) {}

   getAIResponse(message: string): Observable<any> {
    const body = { message };
    return this.http.post<any>(this.apiUrl, body);
  }
}
