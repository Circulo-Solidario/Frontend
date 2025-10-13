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
}
