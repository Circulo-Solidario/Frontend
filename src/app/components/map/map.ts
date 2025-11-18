import { AfterViewInit, Component, ViewChild, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import * as L from 'leaflet';
import { Dots } from '../../services/dots';
import { Toasts } from '../../services/toasts';

@Component({
  selector: 'app-map',
  imports: [ButtonModule, MenuModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class Map implements AfterViewInit, OnDestroy {
  private router: Router = inject(Router);
  private toasts: Toasts = inject(Toasts);
  private dotsService: Dots = inject(Dots);
  private resizeObserver?: ResizeObserver | null = null;
  map!: L.Map;
  userLocation: [number, number] = [-34.6037, -58.3816];
  private userMarker?: L.Marker;
  private userAccuracyCircle?: L.Circle | null = null;
  private geoWatchId?: number;
  private selectedMarker?: L.Marker | null = null;
  private dotsMarkers: L.Marker[] = [];

  @ViewChild('pickPointMenu') pickPointMenu?: Menu;
  pickPointItems: MenuItem[] = [];

  private resizeListener = () => {
    if (this.map) {
      this.map.invalidateSize();
    }
  };

  ngAfterViewInit(): void {
    this.requestGeolocationPermission();

    this.pickPointItems = [
      {
        label: 'Marcar mi posición',
        icon: 'pi pi-map-marker',
        command: () => this.markCurrentPositionAsPoint()
      },
      {
        label: 'Seleccionar en el mapa',
        icon: 'pi pi-compass',
        command: () => this.enableSelectOnMap()
      }
    ];
  }

  private requestGeolocationPermission(): void {
    if (!navigator.geolocation) {
      this.showPermissionError();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        this.getUserLocation();
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          this.showPermissionError();
        } else {
          this.getUserLocation();
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  private showPermissionError(): void {
    this.router.navigate(['/principal']);
    
    setTimeout(() => {
      this.toasts.showToast({
        severity: 'warn',
        summary: 'Permiso y geolocalización requerida',
        detail: 'Para usar el mapa necesitamos obtener tu ubicación, activa los permisos y la geolocalización en tu dispositivo.',
      });
    }, 500);
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = [position.coords.latitude, position.coords.longitude];
          setTimeout(() => this.initMap(), 50);
        },
        () => {
          setTimeout(() => this.initMap(), 50);
        },
        options
      );

      try {
        this.geoWatchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            this.updateUserPosition(latitude, longitude, accuracy ?? undefined);
          },
          () => { },
          options
        );
      } catch (e) { }
    } else {
      setTimeout(() => this.initMap(), 50);
    }
  }

  private initMap(): void {
    this.map = L.map('people-map', {
      center: this.userLocation,
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | © Leaflet'
    }).addTo(this.map);

    this.addUserMarker();

    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    this.loadDots();

    [200, 500, 1000].forEach(delay =>
      setTimeout(() => {
        try { this.map.invalidateSize(true); } catch (e) {}
      }, delay)
    );

    try {
      const wrapper = document.getElementById('people-map')?.parentElement;
      if (wrapper && (window as any).ResizeObserver) {
        this.resizeObserver = new (window as any).ResizeObserver(() => {
          if (this.map) {
            this.map.invalidateSize();
          }
        });
        this.resizeObserver?.observe(wrapper as Element);
      }
    } catch (e) {
      window.addEventListener('resize', this.resizeListener);
    }
  }

  openPickPointMenu(event: Event): void {
    this.pickPointMenu?.toggle(event);
  }

  private markCurrentPositionAsPoint(): void {
    this.placeOrMoveSelectedMarker(this.userLocation[0], this.userLocation[1], false);
    if (this.map) {
      this.map.setView(this.userLocation, Math.max(this.map.getZoom(), 15));
    }
  }

  private enableSelectOnMap(): void {
    this.placeOrMoveSelectedMarker(this.userLocation[0], this.userLocation[1], true);
    if (this.map) {
      this.map.setView(this.userLocation, Math.max(this.map.getZoom(), 15));
    }
  }

  private placeOrMoveSelectedMarker(lat: number, lng: number, draggable: boolean): void {
    const blueIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    if (!this.selectedMarker) {
      this.selectedMarker = L.marker([lat, lng], { draggable, icon: blueIcon })
        .addTo(this.map)
        .bindPopup('Punto seleccionado');
    } else {
      this.selectedMarker.setLatLng([lat, lng]);
      this.selectedMarker.setIcon(blueIcon);
      this.selectedMarker.dragging?.[draggable ? 'enable' : 'disable']?.();
    }
  }

  private addUserMarker(): void {
    if (this.userMarker) {
      this.userMarker.remove();
    }

    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.userMarker = L.marker(this.userLocation, { icon: greenIcon })
      .addTo(this.map)
      .bindPopup('Mi ubicación', {
        className: 'custom-popup-user-location',
        closeButton: false,
        autoClose: true
      });

    if (this.userAccuracyCircle) {
      this.userAccuracyCircle.setLatLng(this.userLocation);
    }
  }

  zoomIn(): void {
    if (this.map) {
      this.map.zoomIn();
    }
  }

  zoomOut(): void {
    if (this.map) {
      this.map.zoomOut();
    }
  }

  centerToCurrentLocation(): void {
    if (this.map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const acc = position.coords.accuracy;
        this.updateUserPosition(lat, lng, acc ?? undefined);
        this.map.setView([lat, lng], Math.max(this.map.getZoom(), 15));
      }, undefined, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    }
  }

  private updateUserPosition(lat: number, lng: number, accuracy?: number): void {
    this.userLocation = [lat, lng];
    if (this.map) {
      if (this.userMarker) {
        this.userMarker.setLatLng([lat, lng]);
      } else {
        this.addUserMarker();
      }
      if (typeof accuracy === 'number' && isFinite(accuracy)) {
        if (!this.userAccuracyCircle) {
          this.userAccuracyCircle = L.circle([lat, lng], {
            radius: accuracy,
            color: '#2ecc71',
            weight: 1,
            fillColor: '#2ecc71',
            fillOpacity: 0.15
          }).addTo(this.map);
        } else {
          this.userAccuracyCircle.setLatLng([lat, lng]);
          this.userAccuracyCircle.setRadius(accuracy);
        }
      }
    }
  }

  private loadDots(): void {
    this.dotsService.getDots().subscribe({
      next: (dots: any[]) => {
        dots.forEach(dot => {
          this.addDotMarker(dot);
        });
      },
      error: (err) => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los puntos de las personas que necesitan ayuda'
        });
      }
    });
  }

  private addDotMarker(dot: any): void {
    const { latitud, longitud, descripcion, estado } = dot;
    
    const iconColor = estado === 'pendiente' ? 'orange' : 'grey';
    const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`;

    const dotIcon = L.icon({
      iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const marker = L.marker([latitud, longitud], { icon: dotIcon })
      .addTo(this.map)
      .bindPopup(descripcion, {
        className: 'custom-popup-dot',
        closeButton: false,
        autoClose: true
      });

    this.dotsMarkers.push(marker);
  }

  ngOnDestroy(): void {
    try {
      if (this.userMarker) {
        this.userMarker.remove();
      }
      if (this.userAccuracyCircle) {
        try { this.userAccuracyCircle.remove(); } catch {}
        this.userAccuracyCircle = null;
      }
      if (this.selectedMarker) {
        try { this.selectedMarker.remove(); } catch {}
        this.selectedMarker = null;
      }
      this.dotsMarkers.forEach(marker => {
        try { marker.remove(); } catch {}
      });
      this.dotsMarkers = [];
      if (this.map) {
        this.map.remove();
      }
      if (this.geoWatchId !== undefined) {
        try { navigator.geolocation.clearWatch(this.geoWatchId); } catch {}
        this.geoWatchId = undefined;
      }
      if (this.resizeObserver) {
        try { this.resizeObserver.disconnect(); } catch (e) {}
        this.resizeObserver = null;
      }
      window.removeEventListener('resize', this.resizeListener);
    } catch (e) {
    }
  }

  goBack(): void {
    this.router.navigate(['/principal']);
  }
}
