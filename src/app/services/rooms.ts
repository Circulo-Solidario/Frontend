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
  private reloadRoomsSubject = new BehaviorSubject<boolean>(false);

  get reloadRooms$(): Observable<boolean>{
    return this.reloadRoomsSubject.asObservable();
  }

  reloadRooms() {
    this.reloadRoomsSubject.next(true);
  }

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

  closeChat(id: any, delivered: boolean): Observable<any>{
    let body = {
      estado: 'ENTREGADA'
    }
    if(!delivered){
      body = {
        estado: 'RECHAZADA'
      }
    }
    return this.httpClient.patch(`${environment.apiUrl}${this.apiPath}/${id}/cambiar-estado`, body);
  }
}

