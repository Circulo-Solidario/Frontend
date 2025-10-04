import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Categories {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiPath = '/categorias';

  getCategories(): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}`);
  }

}
