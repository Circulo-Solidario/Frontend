import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Messages {
  private pusher: Pusher;
  private channel: Channel | null = null;
  private messageSubject: BehaviorSubject<any> = new BehaviorSubject<any>({} as any);
  

  constructor(private http: HttpClient) {
    this.pusher = new Pusher(environment.pusherKey, {
      cluster: environment.pusherCluster,
      forceTLS: true
    });
  }

  get messages$(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  joinRoom(room: string): void {
    if (this.channel) {
      this.channel.unbind_all();
      this.pusher.unsubscribe(this.channel.name);
    }

    this.channel = this.pusher.subscribe(room);

    this.channel.bind('new-message', (data: any) => {
      this.messageSubject.next(data);
    });
  }

  sendMessage(messageRequest: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/mensajes/enviar`, messageRequest);
  }

  getRoomMessages(roomId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mensajes/sala/${roomId}`);
  }

  disconnect(): void {
    if (this.channel) {
      this.pusher.unsubscribe(this.channel.name);
    }
    if(this.pusher){
      this.pusher.disconnect();
    }
  }
}
