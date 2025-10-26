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
    return this.httpCliente.get<boolean>(`${environment.apiUrl}${this.apiPath}/info`, { params: { email } });
  }

  getUserInfoId(id: any): Observable<any>{
    return this.httpCliente.get(`${environment.apiUrl}${this.apiPath}/${id}`);
  }

  async getUserInfo(email: string): Promise<any>{
    return await firstValueFrom(this.httpCliente.get(`${environment.apiUrl}${this.apiPath}/info`, { params: { email } }));
  }

  editUser(id: number, user:any): Observable<any>{
    return this.httpCliente.put(`${environment.apiUrl}${this.apiPath}/${id}`, user); 
  }
}
