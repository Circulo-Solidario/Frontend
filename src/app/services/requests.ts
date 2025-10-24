import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Requests {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiPath = '/productosSolicitados';

  requestProduct(request: any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}${this.apiPath}`, request);
  }

  getRequestsFrom(fromUser?: number | null, toUser?: number | null): Observable<any>{
    let params: any;
    if(fromUser){
      params = { deUsuario: fromUser }
    }
    if(toUser){
      params = { aUsuario: toUser }
    }
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}`, {
      params
    })
  }
}
