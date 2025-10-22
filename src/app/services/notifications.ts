import { Injectable } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface NotificationInter{
  id?: number;
  mensaje: string;
  deUsuario?: string | any;
  aUsuario?: string | any;
  ausuario?: string | any;
  tipoNotificacion?: TipoNotificaciones,
  fechaNotificacion?: string;
  fechaVistaNotificacion?: string | null;
}

export enum TipoNotificaciones{
  NUEVO_MENSAJE,
  NUEVA_SOLICITUD,
  SOLICITUD_ACEPTADA,
  SOLICITUD_RECHAZADA
}

@Injectable({
  providedIn: 'root'
})
export class Notifications {
  private pusher: Pusher;
  private channels: Channel[] = [];
  private notificationSubject: BehaviorSubject<NotificationInter> = new BehaviorSubject<NotificationInter>({} as NotificationInter);

  constructor(private http: HttpClient) { 
    this.pusher = new Pusher(environment.pusherKey, {
      cluster: environment.pusherCluster,
      forceTLS: true
    });
  }

  get notification$(): Observable<NotificationInter> {
    return this.notificationSubject.asObservable();
  }

  getNotifications(userId: string): Observable<Array<any>>{
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const date = sevenDaysAgo.toISOString();
    return this.http.get<Array<any>>(`${environment.apiUrl}/notificaciones/${userId}`, {
      params: {date}
    });
  }

  sendNotification(notification: NotificationInter): Observable<any>{
    return this.http.post(`${environment.apiUrl}/notificaciones/push`, notification);
  }

  markReadNotification(notificationId: number): Observable<any>{
    return this.http.patch(`${environment.apiUrl}/notificaciones/markseen`, notificationId);
  }

  subscribeNotification(room: string): void {
    this.channels.push(this.pusher.subscribe(room)); 
    this.pusher.channel(room).bind('new-notification', (data: NotificationInter) => {
      this.notificationSubject.next(data);
    });
  }

  unsubscribeAllNotification(): Promise<void>{
    this.channels.forEach(channel => {
      this.pusher.unsubscribe(channel.name);    
    });
    return new Promise((resolve) => {resolve();});
  }

  disconnect(): void{
    this.unsubscribeAllNotification();
    this.pusher.disconnect();
  }
}
