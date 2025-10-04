import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Geolocation {
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('La geolocalización no está soportada por este navegador.'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Para continuar por favor habilita tu ubicación'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Ubicación no disponible, intente nuevamente más tarde'));
              break;
            case error.TIMEOUT:
              reject(new Error('Tiempo de espera agotado al obtener la ubicación, intente nuevamente más tarde'));
              break;
            default:
              reject(new Error('Error desconocido al obtener la ubicación, intente nuevamente más tarde'));
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }
}
