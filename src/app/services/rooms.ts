import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Rooms {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiPath = '/salas';
  
  getRequesterRooms(userId: number): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/solicitante/${userId}`);
  }

  getDonorRooms(userId: number): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/donador/${userId}`);
  }
}
