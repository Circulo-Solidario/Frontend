import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Statistics } from '../../services/statistics';
import { LoginService } from '../../services/login';
import { Toasts } from '../../services/toasts';

interface StatItem {
  key: string;
  label: string;
  value: any;
  icon?: string;
  severity?: 'info' | 'success' | 'warning' | 'danger' | 'secondary' | 'contrast';
}

@Component({
  selector: 'app-personal-dashboard',
  templateUrl: './personal-dashboard.html',
  styleUrl: './personal-dashboard.css',
  standalone: true,
  imports: [CommonModule]
})
export class PersonalDashboard implements OnInit {
  private statisticsService: Statistics = inject(Statistics);
  private loginService: LoginService = inject(LoginService);
  private toastService: Toasts = inject(Toasts);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  personalStats: any = null;
  loading = true;
  loggedUser: any = null;
  statItems: StatItem[] = [];
  groupedStats: Record<string, StatItem[]> = {};
  groupedStatsKeys: string[] = [];

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.loggedUser = user;
      if (this.loggedUser == null) {
        this.router.navigate(['/login']);
        return;
      }
      this.loadPersonalStats();
    });
  }

  async loadPersonalStats(): Promise<void> {
    try {
      this.loading = true;
      
      // Usar diferentes endpoints según el tipo de usuario
      if (this.loggedUser.tipoUsuario === 'ORGANIZACION') {
        this.personalStats = await firstValueFrom(
          this.statisticsService.getOrganizationProjectStats(this.loggedUser.id)
        );
      } else {
        this.personalStats = await firstValueFrom(
          this.statisticsService.getPersonalStats(this.loggedUser.id)
        );
      }
      
      if (this.personalStats && typeof this.personalStats === 'object') {
        this.processStats(this.personalStats);
      }
      
      this.toastService.showToast({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Estadísticas personales cargadas',
      });
    } catch (error) {
      console.error('Error al cargar estadísticas personales:', error);
      this.toastService.showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las estadísticas personales',
      });
    } finally {
      this.loading = false;
    }
  }

  private processStats(stats: any): void {
    this.statItems = [];
    this.groupedStats = {};

    Object.entries(stats).forEach(([key, value]) => {
      // Filtrar estadísticas según el tipo de usuario
      if (!this.shouldShowStat(key)) {
        return;
      }

      const item: StatItem = {
        key,
        label: this.getFriendlyLabel(key),
        value: value,
        icon: this.getIconForKey(key),
        severity: this.getSeverityForKey(key)
      };

      this.statItems.push(item);

      const group = this.getGroupLabel(key);
      if (!this.groupedStats[group]) {
        this.groupedStats[group] = [];
      }
      this.groupedStats[group].push(item);
    });

    this.groupedStatsKeys = Object.keys(this.groupedStats);
  }

  private shouldShowStat(key: string): boolean {
    const k = String(key).toLowerCase();
    const userType = this.loggedUser?.tipoUsuario;
    const userRoles = this.loggedUser?.roles || [];

    // Estadísticas de proyectos - solo para organizaciones
    if (k.includes('proyecto') || k.includes('project')) {
      return userType === 'ORGANIZACION';
    }

    // Estadísticas de productos - solo para usuarios (no organizaciones)
    if (k.includes('producto') || k.includes('product')) {
      return userType === 'USUARIO';
    }

    // Estadísticas de solicitudes - solo para usuarios con rol DONANTE o DONATARIO
    if (k.includes('solicitud') || k.includes('request')) {
      const roleIds = userRoles.map((role: any) => role.id);
      const hasRole = (id: number) => roleIds.includes(id);
      return userType === 'USUARIO' && (hasRole(2) || hasRole(3)); // DONANTE (2) o DONATARIO (3)
    }

    // Estadísticas de donaciones - mostrar para todos (usuarios y organizaciones)
    if (k.includes('donacion') || k.includes('donation')) {
      return true;
    }

    // Mensajes y otros - mostrar para todos
    return true;
  }

  private getFriendlyLabel(key: string): string {
    const labelMap: Record<string, string> = {
      'total_usuarios': 'Usuarios totales',
      'total_products': 'Productos totales',
      'total_requests': 'Solicitudes totales',
      'total_proyectos': 'Proyectos totales',
      'total_mensajes': 'Mensajes totales',
      'total_donations': 'Donaciones totales',
      'productos_publicados': 'Productos publicados',
      'productos_donados': 'Productos donados',
      'solicitudes_realizadas': 'Solicitudes realizadas',
      'solicitudes_aceptadas': 'Solicitudes aceptadas',
      'proyectos_publicados': 'Proyectos publicados',
      'mensajes_enviados': 'Mensajes enviados',
    };

    if (labelMap[key]) return labelMap[key];
    
    const snake = key
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[-\s]+/g, '_')
      .toLowerCase();
    
    if (labelMap[snake]) return labelMap[snake];

    const human = key
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ');
    
    return human.charAt(0).toUpperCase() + human.slice(1);
  }

  private getGroupLabel(key: string): string {
    const k = String(key).toLowerCase();
    
    if (k.includes('producto')) return 'Productos';
    if (k.includes('solicitud') || k.includes('request')) return 'Solicitudes';
    if (k.includes('proyecto') || k.includes('project')) return 'Proyectos';
    if (k.includes('mensaje') || k.includes('message')) return 'Mensajes';
    if (k.includes('donacion') || k.includes('donation')) return 'Donaciones';
    if (k.includes('usuario') || k.includes('user')) return 'Usuarios';
    if (k.includes('total')) return 'Totales';
    
    return 'Otros';
  }

  private getIconForKey(key: string): string {
    const k = String(key).toLowerCase();
    
    if (k.includes('producto')) return 'pi pi-shopping-bag';
    if (k.includes('solicitud') || k.includes('request')) return 'pi pi-list-check';
    if (k.includes('proyecto') || k.includes('project')) return 'pi pi-chart-line';
    if (k.includes('mensaje') || k.includes('message')) return 'pi pi-envelope';
    if (k.includes('donacion') || k.includes('donation')) return 'pi pi-heart';
    if (k.includes('usuario') || k.includes('user')) return 'pi pi-users';
    
    return 'pi pi-chart-bar';
  }

  private getSeverityForKey(key: string): StatItem['severity'] {
    const k = String(key).toLowerCase();
    
    if (k.includes('aceptada')) return 'success';
    if (k.includes('rechazada')) return 'danger';
    if (k.includes('pendiente')) return 'warning';
    if (k.includes('publican') || k.includes('publicado')) return 'info';
    
    return 'secondary';
  }

  goBack(): void {
    this.router.navigate(['/principal']);
  }
}

