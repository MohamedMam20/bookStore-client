import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io ,Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = io('http://localhost:3000', {
      withCredentials:true,
    });
  }
  listenToNewOrders():Observable<any> {
    return new Observable ((observer)=>{
      this.socket.on('newOrderNotification', (data)=> {
        observer.next(data);
      });
    });
  }
  disconnect(): void {
    if(this.socket){
      this.socket.disconnect();
    }
  }
}
