import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Statistics {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiPath = '/estadisticas';

  getGlobalStats(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/global`);
  }

  getPersonalStats(userId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/global/personal/${userId}`);
  }

  getOrganizationProjectStats(organizationId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/global/organizacion/${organizationId}/proyectos`);
  }

  getTotalDonatedToProjects(userId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/global/personal/${userId}/donaciones-proyectos`);
  }
}
