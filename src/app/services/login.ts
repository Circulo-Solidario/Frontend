import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private loggedUser = new BehaviorSubject<any>(null)
  loggedUser$ = this.loggedUser.asObservable();

  async login(credentials: any): Promise<any>{    
    return await firstValueFrom(this.httpClient.post(`${environment.apiUrl}/login`, credentials));
  }

  setLoggedUser(user: any){    
    localStorage.setItem('loggedUser', JSON.stringify(user));
    this.loggedUser.next(user);
  }

  getLoggedUser(): Observable<any>{
    const storedUser = localStorage.getItem('loggedUser');
    if(storedUser && !this.loggedUser.value){
      this.loggedUser.next(JSON.parse(storedUser));
    }
    return this.loggedUser$;
  }

  logOut(){
    localStorage.removeItem('loggedUser');
    this.loggedUser.next(null);
  }
}
