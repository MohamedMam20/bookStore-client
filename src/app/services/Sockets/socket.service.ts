import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io ,Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.connect();
  }

  private connect():void {
    this.socket = io(environment.apiUrl, {
      withCredentials:true,
    });

    console.log("🔌 Attempting to conect to socket server");
    this.socket.on('connect', () => {
      console.log('✅ Socket connected!', this.socket.id);
    });

    this.socket.on('connect_error',(err)=> {
      console.error('❌ Socket connection error:', err.message);
    })
  }


  listen(eventName:string): Observable<any>{
    return new Observable(Observer =>{
      const handler = (data:any) => Observer.next(data);
      this.socket.on(eventName,handler);
      return () => this.socket.off(eventName,handler);
    });
  }

  emit(eventName:string,data:any):void {
    this.socket.emit(eventName,data);
  }

  listenToNewOrders(): Observable<any> {
    return new Observable(observer => {
      const handler = (data:any) => {
        console.log("📩 Received WebSocket notification:", data);
        observer.next(data);
      };
      this.socket.on('newOrderNotification',handler);

      this.socket.onAny((event, ...args)=>{
        console.log('📡 [Socket DEBUG] Event:', event, args);
      });

      return () => this.socket.off('newOrderNotification',handler);
    });
  }

  disconnect():void {
    if(this.socket && this.socket.connected){
      this.socket.disconnect();
      console.log("🔌 Socket disconnected");
    }
  }
}
