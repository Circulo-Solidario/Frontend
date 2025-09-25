import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  async login(credentials: any): Promise<any>{
    return await firstValueFrom(this.httpClient.post(`${environment.apiUrl}/login`, credentials));
  }
}
