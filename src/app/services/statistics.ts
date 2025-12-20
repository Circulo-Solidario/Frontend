import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Statistics {
  private readonly httpClient = inject(HttpClient);
  private readonly apiPath = '/estadisticas';

  /** 🌍 Estadísticas globales */
  getGlobalStats(): Observable<any> {
    return this.httpClient.get(
      `${environment.apiUrl}${this.apiPath}/global`
    );
  }

  /** 👤 Estadísticas personales */
  getPersonalStats(userId: number): Observable<any> {
    return this.httpClient.get(
      `${environment.apiUrl}${this.apiPath}/personal/${userId}`
    );
  }

  /** 🏢 Estadísticas organización */
  getOrganizationStats(orgId: number): Observable<any> {
    return this.httpClient.get(
      `${environment.apiUrl}${this.apiPath}/organizacion/${orgId}`
    );
  }

  // Estadísticas personales completas (nuevo endpoint)
getPersonalFullStats(userId: number): Observable<any> {
  return this.httpClient.get<any>(
    `${environment.apiUrl}/estadisticas/personales/${userId}`
  );
}

}
