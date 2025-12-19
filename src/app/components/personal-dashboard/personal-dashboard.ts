import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { Statistics } from '../../services/statistics';
import { LoginService } from '../../services/login';
import { Toasts } from '../../services/toasts';
import { Messages } from '../../services/messages';
import { Notifications } from '../../services/notifications';
import { Rooms } from '../../services/rooms';

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
  imports: [CommonModule],
})
export class PersonalDashboard implements OnInit {
  private statisticsService: Statistics = inject(Statistics);
  private loginService: LoginService = inject(LoginService);
  private toastService: Toasts = inject(Toasts);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private messagesService: Messages = inject(Messages);
  private notificationsService: Notifications = inject(Notifications);
  private roomsService: Rooms = inject(Rooms);

  private subscriptions: Subscription[] = [];

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
    });

    this.loadPersonalStats();

    // Suscribirse a eventos en tiempo real que pueden cambiar estadísticas    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async loadPersonalStats(suppressToast = true): Promise<void> {
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
        this.personalStats = this.normalizePersonalStats(this.personalStats);
        console.info('personal-dashboard: normalized personalStats', this.personalStats);
        this.processStats(this.personalStats);
      }

      if (!suppressToast) {
        this.toastService.showToast({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Estadísticas personales cargadas',
        });
      }
    } catch (error) {
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
        severity: this.getSeverityForKey(key),
      };

      this.statItems.push(item);

      const group = this.getGroupLabel(key);
      if (!this.groupedStats[group]) {
        this.groupedStats[group] = [];
      }
      this.groupedStats[group].push(item);
    });

    // Agregar estadísticas derivadas (tasas, promedios, etc.)
    this.addDerivedStats();

    this.groupedStatsKeys = Object.keys(this.groupedStats);
  }

  private addDerivedStats(): void {
    // Tasa de éxito de productos (productos donados / productos publicados)
    if (
      this.personalStats &&
      this.personalStats.productos_publicados != null &&
      this.personalStats.productos_donados != null &&
      this.personalStats.productos_publicados > 0
    ) {
      const tasa = Math.round(
        (this.personalStats.productos_donados / this.personalStats.productos_publicados) * 100
      );
      const item: StatItem = {
        key: 'productos_tasa_exito',
        label: this.getFriendlyLabel('productos_tasa_exito'),
        value: `${tasa}%`,
        icon: 'pi pi-percentage',
        severity: tasa >= 70 ? 'success' : tasa >= 40 ? 'info' : 'warning',
      };

      if (!this.groupedStats['Productos']) {
        this.groupedStats['Productos'] = [];
      }
      this.groupedStats['Productos'].push(item);
      this.statItems.push(item);
    }

    // Tasa de aceptación de solicitudes (aceptadas / realizadas)
    if (
      this.personalStats &&
      this.personalStats.solicitudes_realizadas != null &&
      this.personalStats.solicitudes_aceptadas != null &&
      this.personalStats.solicitudes_realizadas > 0
    ) {
      const tasa = Math.round(
        (this.personalStats.solicitudes_aceptadas / this.personalStats.solicitudes_realizadas) * 100
      );
      const item: StatItem = {
        key: 'solicitudes_tasa_aceptacion',
        label: this.getFriendlyLabel('solicitudes_tasa_aceptacion'),
        value: `${tasa}%`,
        icon: 'pi pi-check-circle',
        severity: tasa >= 70 ? 'success' : tasa >= 40 ? 'info' : 'warning',
      };

      if (!this.groupedStats['Solicitudes']) {
        this.groupedStats['Solicitudes'] = [];
      }
      this.groupedStats['Solicitudes'].push(item);
      this.statItems.push(item);
    }

    // Productos pendientes por donar (creados - donados)
    if (
      this.personalStats &&
      this.personalStats.productos_publicados != null &&
      this.personalStats.productos_donados != null
    ) {
      const pendientes =
        this.personalStats.productos_publicados - this.personalStats.productos_donados;
      if (pendientes > 0) {
        const item: StatItem = {
          key: 'productos_pendientes_donar',
          label: 'Productos pendientes',
          value: pendientes,
          icon: 'pi pi-inbox',
          severity: 'warning',
        };

        if (!this.groupedStats['Productos']) {
          this.groupedStats['Productos'] = [];
        }
        this.groupedStats['Productos'].push(item);
        this.statItems.push(item);
      }
    }

    // Solicitudes pendientes
    if (
      this.personalStats &&
      this.personalStats.solicitudes_realizadas != null &&
      this.personalStats.solicitudes_aceptadas != null
    ) {
      const pendientes =
        this.personalStats.solicitudes_realizadas - this.personalStats.solicitudes_aceptadas;
      if (pendientes > 0) {
        const item: StatItem = {
          key: 'solicitudes_pendientes',
          label: this.getFriendlyLabel('solicitudes_pendientes'),
          value: pendientes,
          icon: 'pi pi-hourglass',
          severity: 'warning',
        };

        if (!this.groupedStats['Solicitudes']) {
          this.groupedStats['Solicitudes'] = [];
        }
        this.groupedStats['Solicitudes'].push(item);
        this.statItems.push(item);
      }
    }

    // Proyectos activos
    if (this.personalStats && this.personalStats.proyectos_publicados != null) {
      const item: StatItem = {
        key: 'proyectos_activos',
        label: this.getFriendlyLabel('proyectos_activos'),
        value: this.personalStats.proyectos_publicados,
        icon: 'pi pi-play-circle',
        severity: 'info',
      };

      if (!this.groupedStats['Proyectos']) {
        this.groupedStats['Proyectos'] = [];
      }
      this.groupedStats['Proyectos'].push(item);
      this.statItems.push(item);
    }

    // Mensajes recibidos (si existe información de conversaciones)
    if (this.personalStats && this.personalStats.mensajes_enviados != null) {
      // Estimación de mensajes recibidos (puede ser igual o basado en datos del backend)
      const recibidos =
        this.personalStats.mensajes_recibidos ||
        Math.max(0, Math.round(this.personalStats.mensajes_enviados * 0.8));

      const item: StatItem = {
        key: 'mensajes_recibidos',
        label: this.getFriendlyLabel('mensajes_recibidos'),
        value: recibidos,
        icon: 'pi pi-inbox',
        severity: 'secondary',
      };

      if (!this.groupedStats['Mensajes']) {
        this.groupedStats['Mensajes'] = [];
      }
      this.groupedStats['Mensajes'].push(item);
      this.statItems.push(item);
    }

    // Ratio de donaciones (totales realizadas vs recibidas)
    if (
      this.personalStats &&
      (this.personalStats.total_donations != null || this.personalStats.donaciones_totales != null)
    ) {
      const totalDonaciones =
        this.personalStats.total_donations || this.personalStats.donaciones_totales || 0;
      const item: StatItem = {
        key: 'donaciones_totales',
        label: this.getFriendlyLabel('donaciones_totales'),
        value: totalDonaciones,
        icon: 'pi pi-heart-fill',
        severity: 'success',
      };

      if (!this.groupedStats['Donaciones']) {
        this.groupedStats['Donaciones'] = [];
      }
      // Evitar duplicados
      const exists = this.groupedStats['Donaciones'].some(
        (s) => s.key === 'donaciones_totales' || s.key === 'total_donations'
      );
      if (!exists) {
        this.groupedStats['Donaciones'].push(item);
        this.statItems.push(item);
      }
    }
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
      total_usuarios: 'Usuarios totales',
      total_products: 'Productos totales',
      total_requests: 'Solicitudes totales',
      total_proyectos: 'Proyectos totales',
      total_mensajes: 'Mensajes totales',
      total_donations: 'Donaciones totales',
      productos_publicados: 'Productos publicados',
      productos_donados: 'Productos donados',
      productos_disponibles: 'Productos disponibles',
      productos_tasa_exito: 'Tasa de éxito de productos',
      solicitudes_realizadas: 'Solicitudes realizadas',
      solicitudes_aceptadas: 'Solicitudes aceptadas',
      solicitudes_tasa_aceptacion: 'Tasa de aceptación',
      solicitudes_pendientes: 'Solicitudes pendientes',
      proyectos_publicados: 'Proyectos publicados',
      proyectos_activos: 'Proyectos activos',
      proyectos_tasa_recaudacion: 'Tasa de recaudación',
      mensajes_enviados: 'Mensajes enviados',
      mensajes_recibidos: 'Mensajes recibidos',
      donaciones_totales: 'Donaciones realizadas',
      donaciones_recibidas: 'Donaciones recibidas',
      notificaciones_no_leidas: 'Notificaciones no leídas',
    };

    if (labelMap[key]) return labelMap[key];

    const snake = key
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[-\s]+/g, '_')
      .toLowerCase();

    if (labelMap[snake]) return labelMap[snake];

    const human = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');

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
    if (k.includes('notificacion') || k.includes('notification')) return 'Notificaciones';

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
    if (k.includes('tasa') || k.includes('porcentaje')) return 'pi pi-percentage';
    if (k.includes('pendiente')) return 'pi pi-hourglass';
    if (k.includes('activo')) return 'pi pi-play-circle';
    if (k.includes('notificacion') || k.includes('notification')) return 'pi pi-bell';

    return 'pi pi-chart-bar';
  }

  private getSeverityForKey(key: string): StatItem['severity'] {
    const k = String(key).toLowerCase();

    if (k.includes('aceptada')) return 'success';
    if (k.includes('rechazada') || k.includes('error')) return 'danger';
    if (k.includes('pendiente') || k.includes('hourglass')) return 'warning';
    if (k.includes('publican') || k.includes('publicado') || k.includes('activo')) return 'info';
    if (
      k.includes('tasa') ||
      k.includes('porcentaje') ||
      k.includes('exito') ||
      k.includes('aceptacion')
    )
      return 'success';
    if (k.includes('heart') || k.includes('donacion')) return 'success';

    return 'secondary';
  }

  private normalizePersonalStats(stats: any): any {
    const out: any = { ...stats };
    const toNum = (v: any) => {
      if (v == null) return 0;
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const cleaned = v.replace(/,/g, '');
        const n = Number(cleaned);
        return isNaN(n) ? 0 : n;
      }
      return 0;
    };

    // productos_creados
    if (out.productos_creados == null) {
      if (stats.productos && typeof stats.productos === 'object') {
        if ('cantidadPublicados' in stats.productos)
          out.productos_creados = toNum(stats.productos.cantidadPublicados);
        else if ('cantidad_publicados' in stats.productos)
          out.productos_creados = toNum(stats.productos.cantidad_publicados);
        else if ('cantidadPublicadosTotal' in stats.productos)
          out.productos_creados = toNum(stats.productos.cantidadPublicadosTotal);
      }
    } else {
      out.productos_creados = toNum(out.productos_creados);
    }

    // productos_disponibles (try cantidadPorEstado['disponible'] or similar)
    if (out.productos_disponibles == null) {
      if (stats.productos && typeof stats.productos === 'object') {
        const cpe = stats.productos.cantidadPorEstado || stats.productos.cantidad_por_estado || {};
        let dispo = 0;
        if (cpe && typeof cpe === 'object') {
          for (const k of Object.keys(cpe)) {
            if (k.toLowerCase().includes('dispon')) {
              dispo += toNum(cpe[k]);
            }
          }
        }
        if (dispo > 0) out.productos_disponibles = dispo;
        else if ('cantidadDisponibles' in stats.productos)
          out.productos_disponibles = toNum(stats.productos.cantidadDisponibles);
        else if ('disponibles' in stats.productos)
          out.productos_disponibles = toNum(stats.productos.disponibles);
      }
    } else {
      out.productos_disponibles = toNum(out.productos_disponibles);
    }

    // productos_solicitados_por_usuario
    if (out.productos_solicitados_por_usuario == null) {
      if (stats.solicitudes && typeof stats.solicitudes === 'object') {
        if ('realizadas' in stats.solicitudes)
          out.productos_solicitados_por_usuario = toNum(stats.solicitudes.realizadas);
        else if ('cantidad' in stats.solicitudes)
          out.productos_solicitados_por_usuario = toNum(stats.solicitudes.cantidad);
      }
      if (
        out.productos_solicitados_por_usuario == null &&
        stats.productos &&
        typeof stats.productos === 'object' &&
        'cantidadSolicitadas' in stats.productos
      ) {
        out.productos_solicitados_por_usuario = toNum(stats.productos.cantidadSolicitadas);
      }
    } else {
      out.productos_solicitados_por_usuario = toNum(out.productos_solicitados_por_usuario);
    }

    // mensajes_enviados
    if (out.mensajes_enviados == null) {
      if (stats.mensajes && typeof stats.mensajes === 'object') {
        if ('enviados' in stats.mensajes) out.mensajes_enviados = toNum(stats.mensajes.enviados);
        else if ('total' in stats.mensajes) out.mensajes_enviados = toNum(stats.mensajes.total);
      }
      if (out.mensajes_enviados == null && 'total_mensajes' in stats)
        out.mensajes_enviados = toNum(stats.total_mensajes);
    } else {
      out.mensajes_enviados = toNum(out.mensajes_enviados);
    }

    // notificaciones_no_leidas
    if (out.notificaciones_no_leidas == null) {
      if (stats.notificaciones && typeof stats.notificaciones === 'object') {
        if ('noLeidas' in stats.notificaciones)
          out.notificaciones_no_leidas = toNum(stats.notificaciones.noLeidas);
        else if ('no_leidas' in stats.notificaciones)
          out.notificaciones_no_leidas = toNum(stats.notificaciones.no_leidas);
      }
      if (out.notificaciones_no_leidas == null && typeof stats.notificaciones === 'number')
        out.notificaciones_no_leidas = toNum(stats.notificaciones);
    } else {
      out.notificaciones_no_leidas = toNum(out.notificaciones_no_leidas);
    }

    return out;
  }

  goBack(): void {
    this.router.navigate(['/principal']);
  }
}
