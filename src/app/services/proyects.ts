import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Proyects {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiPath = environment.apiUrl + '/proyectos';
  private idProyect: any;

  postProyect(proyect: any): Observable<any>{
    return this.http.post(`${this.apiPath}`, proyect);
  }

  getProyects(orgId: number | null, state: string | null, name: string | null): Observable<any>{
    let filters = {}
    if(orgId){
      filters = {
        ...filters,
        idOrganizacion: orgId
      }
    }
    if(state){
      filters = {
        ...filters,
        estado: state
      }
    }
    if(name){
      filters = {
        ...filters,
        nombre: name
      }
    }
    return this.http.get(`${this.apiPath}`, { params: filters});
  }

  getProyect(id: any): Observable<any>{
    return this.http.get(`${this.apiPath}/${id}`);
  }

}
