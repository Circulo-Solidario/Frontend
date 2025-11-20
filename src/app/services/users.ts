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

  getFilteredUsers(valid: any, userType: any): Observable<any>{
    let filters: any;
    if(valid){
      filters = {
        valid: valid
      }
    }
    if(userType){
      filters = {
        ...filters,
        tipoUsuario: userType
      }
    }
    return this.httpCliente.get(`${environment.apiUrl}${this.apiPath}/filtrar`, {
      params: filters
    })
  }

  postDocumentes(id: any, document: File): Observable<any>{
    const formData = new FormData();
    formData.append('archivo', document);    
    return this.httpCliente.post(`${environment.apiUrl}${this.apiPath}/${id}/documentos`, formData);
  }

  downloadDocument(idOrg: any, idDoc: any): Observable<Blob>{
    return this.httpCliente.get(`${environment.apiUrl}${this.apiPath}/${idOrg}/documentos/${idDoc}/descargar`, { responseType: 'blob' });
  }

  getDocumentsFromUser(idOrg: any): Observable<any>{
    return this.httpCliente.get(`${environment.apiUrl}${this.apiPath}/${idOrg}/documentos`);
  }

  deleteDocument(idOrg: any, idDoc: any): Observable<any>{
    return this.httpCliente.delete(`${environment.apiUrl}${this.apiPath}/${idOrg}/documentos/${idDoc}`);
  }
}
