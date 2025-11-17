import { AfterViewInit, Component, ViewChild, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [ButtonModule, MenuModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class Map implements AfterViewInit, OnDestroy {
  private router: Router = inject(Router);
  private resizeObserver?: ResizeObserver | null = null;
  map!: L.Map;
  userLocation: [number, number] = [-34.6037, -58.3816]; // Buenos Aires default
  private userMarker?: L.Marker;
  private userAccuracyCircle?: L.Circle | null = null;
  private geoWatchId?: number;
  private selectedMarker?: L.Marker | null = null;

  @ViewChild('pickPointMenu') pickPointMenu?: Menu;
  pickPointItems: MenuItem[] = [];

  private resizeListener = () => {
    if (this.map) {
      this.map.invalidateSize();
    }
  };

  ngAfterViewInit(): void {
    // Get user location first, then init map
    this.getUserLocation();

    // Setup menu items for picking a point
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
          // If geolocation fails, use default and init map anyway
          setTimeout(() => this.initMap(), 50);
        },
        options
      );

      // Start watch to improve accuracy over time and follow movement
      try {
        this.geoWatchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            this.updateUserPosition(latitude, longitude, accuracy ?? undefined);
          },
          () => { /* ignore watch errors */ },
          options
        );
      } catch (e) { /* ignore */ }
    } else {
      // Geolocation not supported, use default
      setTimeout(() => this.initMap(), 50);
    }
  }

  private initMap(): void {
    this.map = L.map('people-map', {
      center: this.userLocation,
      zoom: 13,
      zoomControl: false // Disable default zoom control
    });

    // Add tile layer with proper attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | © Leaflet'
    }).addTo(this.map);

    // Add green marker for user location
    this.addUserMarker();

    // Add custom zoom controls
    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    // Force Leaflet to recalculate size
    [200, 500, 1000].forEach(delay =>
      setTimeout(() => {
        try { this.map.invalidateSize(true); } catch (e) {}
      }, delay)
    );

    // Use ResizeObserver to detect when the map wrapper actually gets sized
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
      // fallback to window resize
      window.addEventListener('resize', this.resizeListener);
    }
  }

  // UI: open popup menu to choose how to mark a point
  openPickPointMenu(event: Event): void {
    this.pickPointMenu?.toggle(event);
  }

  // Option A: add a fixed marker at current geolocation
  private markCurrentPositionAsPoint(): void {
    this.placeOrMoveSelectedMarker(this.userLocation[0], this.userLocation[1], false);
    if (this.map) {
      this.map.setView(this.userLocation, Math.max(this.map.getZoom(), 15));
    }
  }

  // Option B: add a draggable marker at current geolocation
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

    // Create a green icon for the user location
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
      .bindPopup('Mi ubicación');

    // draw/update accuracy circle if we have one already
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
      // Update marker
      if (this.userMarker) {
        this.userMarker.setLatLng([lat, lng]);
      } else {
        this.addUserMarker();
      }

      // Update or create accuracy circle
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
      // nothing to do
    }
  }

  goBack(): void {
    this.router.navigate(['/principal']);
  }
}
