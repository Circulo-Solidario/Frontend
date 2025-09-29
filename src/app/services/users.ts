import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Users {
  private readonly apiPath = '/usuarios';
  private readonly httpCliente: HttpClient = inject(HttpClient)

  async registerUser(user: any): Promise<any>{
    return await firstValueFrom(this.httpCliente.post(`${environment.apiUrl}${this.apiPath}`, user));
  }

  validateEmail(email: string): Observable<boolean>{
    return this.httpCliente.get<boolean>(`${environment.apiUrl}${this.apiPath}/existe/${email}`);
  }

  async getUserInfo(email: string): Promise<any>{
    return await firstValueFrom(this.httpCliente.get(`${environment.apiUrl}${this.apiPath}/info/${email}`));
  }
}
