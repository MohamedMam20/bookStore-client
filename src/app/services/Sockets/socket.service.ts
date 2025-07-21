import { Injectable } from '@angular/core';
import { Observable, share } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private listeners: Map<string, Observable<any>> = new Map();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = io(environment.socketUrl, {
      withCredentials: true,
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }

  listen(eventName: string): Observable<any> {
    // Check if we already have a listener for this event
    if (!this.listeners.has(eventName)) {
      // Create a new observable and store it
      const newObservable = new Observable((observer) => {
        const handler = (data: any) => observer.next(data);
        this.socket.on(eventName, handler);
        
        return () => {
          this.socket.off(eventName, handler);
        };
      }).pipe(share()); // Share the observable so multiple subscribers get the same events
      
      this.listeners.set(eventName, newObservable);
    }
    
    return this.listeners.get(eventName)!;
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
      this.listeners.clear();
    }
  }
}
