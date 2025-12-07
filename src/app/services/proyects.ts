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

  setIdProyect(id: any){
    this.idProyect = id;
  }

  getIdProyect(){
    return this.idProyect;
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

  saveIdProyect(id: any){
    localStorage.setItem('proyectId', id);
  }

  updateFounding(id: any, amount: any, idUser: any): Observable<any>{
    let founding = {
      "recaudado": amount,
      "usuarioId": idUser
    }
    return this.http.patch(`${this.apiPath}/${id}/actualizar-recaudado`, founding);
  }

  deleteProyect(id: any): Observable<any>{
    return this.http.delete(`${this.apiPath}/${id}`);
  }

  editProyect(id: any, proyect: any): Observable<any>{
    return this.http.put(`${this.apiPath}/${id}`, proyect);
  }
}
