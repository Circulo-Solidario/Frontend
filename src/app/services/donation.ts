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
  private readonly mpKey = 'APP_USR-e0fd294a-60f4-4ba3-98f8-d22e14eaf6a3';

  async createPreference(proyectName: string, amount: number, donorEmail: string): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<{ preferenceId: string }>(this.apiUrl, {
        nombreProyecto: proyectName,
        monto: amount,
        donadorEmail: donorEmail
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
