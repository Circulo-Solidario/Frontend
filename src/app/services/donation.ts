import { inject, Injectable } from '@angular/core';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Donation {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/donaciones`;
  private readonly mpKey = 'APP_USR-494bc242-a343-4b9f-806b-4ab567744ec3';

  async createPreference(proyectId: number, amount: number): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<{ preferenceId: string }>(this.apiUrl, {
        proyectoId: proyectId,
        monto: amount
      })
    );
    return res.preferenceId;
  }

  async initMercadoPago() {
    await loadMercadoPago();
    return new (window as any).MercadoPago(this.mpKey, { locale: 'es-AR' });
  }

  async createPayButton(preferenceId: string) {
    const mp = await this.initMercadoPago();
    const bricksBuilder = mp.bricks();

    await bricksBuilder.create('wallet', 'wallet_container', {
      initialization: {
        preferenceId
      },
      customization: {
        texts: { valueProp: 'smart_option' }
      }
    });
  }
  
}
