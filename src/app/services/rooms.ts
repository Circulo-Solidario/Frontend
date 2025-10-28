import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Rooms {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiPath = '/salas';
  private chatSubject = new BehaviorSubject<any>(null);

  get chat$(): Observable<any>{
    return this.chatSubject.asObservable();
  }

  setChat(chat: any) {
    this.chatSubject.next(chat);
  }
  
  getRequesterRooms(userId: number): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/solicitante/${userId}`);
  }

  getDonorRooms(userId: number): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/donador/${userId}`);
  }
}
