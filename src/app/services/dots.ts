import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dots {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiPath = `${environment.apiUrl}/puntos`;

  getDots(): Observable<any>{
    return this.httpClient.get<any>(this.apiPath);
  }

  postDot(dot: any): Observable<any>{
    return this.httpClient.post<any>(this.apiPath, dot);
  }

  updateStateDot(id: any, state: any): Observable<any>{
    return this.httpClient.put(`${this.apiPath}/${id}/estado`, state);
  }

  deleteDot(id: any): Observable<any>{
    return this.httpClient.delete(`${this.apiPath}/${id}`);
  }
}
