import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { Statistics } from '../../services/statistics';
import { Toasts } from '../../services/toasts';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-global-stats',
  imports: [CommonModule, Button],
  templateUrl: './global-stats.html',
  styleUrl: './global-stats.css',
})
export class GlobalStats implements OnInit {
  private statisticsService: Statistics = inject(Statistics);
  private toastService: Toasts = inject(Toasts);

  globalStats: any = null;
  globalStatsEntries: Array<{ key: string; value: any; label?: string; sanitizedKey?: string }> = [];
  groupedStats: Record<string, Array<{ key: string; value: any; label?: string; sanitizedKey?: string }>> = {};
  groupedStatsKeys: string[] = [];

  private labelMap: Record<string, string> = {
    total_users: 'Usuarios totales',
    total_products: 'Productos totales',
    total_requests: 'Solicitudes totales',
  };

  ngOnInit(): void {
    this.loadGlobalStats();
  }

  private capitalizeWords(s: string) {
    return s
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private getFriendlyLabel(key: string) {
    if (!key) return '';
    if (this.labelMap[key]) return this.labelMap[key];
    const snake = key
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[-\s]+/g, '_')
      .toLowerCase();
    if (this.labelMap[snake]) return this.labelMap[snake];

    if (snake.startsWith('total_')) {
      const rest = snake.substring(6).replace(/_/g, ' ');
      return 'Total de ' + this.capitalizeWords(rest);
    }

    const human = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
    return this.capitalizeWords(human);
  }

  private getGroupLabel(key: string) {
    if (!key) return 'Otros';
    const k = String(key).toLowerCase();
    if (k.includes('user') || k.includes('usuario') || k.includes('usuarios')) return 'Usuarios';
    if (k.includes('product') || k.includes('producto') || k.includes('productos')) return 'Productos';
    if (k.includes('request') || k.includes('solicitud') || k.includes('requests')) return 'Solicitudes';
    if (k.includes('proyect') || k.includes('proyecto') || k.includes('proyectos')) return 'Proyectos';
    if (k.includes('message') || k.includes('mensaje') || k.includes('mensajes') || k.includes('chat')) return 'Mensajes';
    if (k.includes('room') || k.includes('rooms')) return 'Salas';
    if (k.includes('total')) return 'Totales';
    return 'Otros';
  }

  async loadGlobalStats(): Promise<void> {
    try {
      this.globalStats = await firstValueFrom(this.statisticsService.getGlobalStats());
      if (this.globalStats && typeof this.globalStats === 'object') {
        this.globalStatsEntries = Object.entries(this.globalStats).map(([k, v]) => ({
          key: k,
          sanitizedKey: String(k).replace(/[^a-zA-Z0-9_-]/g, '_'),
          label: this.getFriendlyLabel(String(k)),
          value: v,
        }));
      } else {
        this.globalStatsEntries = [{ key: 'data', sanitizedKey: 'data', label: 'data', value: this.globalStats }];
      }

      this.groupedStats = {};
      this.globalStatsEntries.forEach((entry) => {
        const group = this.getGroupLabel(entry.key);
        if (!this.groupedStats[group]) this.groupedStats[group] = [];
        this.groupedStats[group].push(entry);
      });
      this.groupedStatsKeys = Object.keys(this.groupedStats);

      this.toastService.showToast({ severity: 'success', summary: 'Estadísticas', detail: 'Estadísticas globales cargadas correctamente' });
    } catch (error) {
      console.error('Error al obtener estadísticas globales:', error);
      this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener las estadísticas globales' });
    }
  }
}
