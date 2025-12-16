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
  imports: [CommonModule]
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
      this.loadPersonalStats();

      // Suscribirse a eventos en tiempo real que pueden cambiar estadísticas
      try {
        this.subscriptions.push(
          this.messagesService.messages$.subscribe((m) => {
            if (m) this.loadPersonalStats(true);
          })
        );
      } catch (e) {
      }

      try {
        this.subscriptions.push(
          this.notificationsService.notification$.subscribe((n) => {
            if (n) this.loadPersonalStats(true);
          })
        );
      } catch (e) {}

      try {
        this.subscriptions.push(
          this.roomsService.reloadRooms$.subscribe((r) => {
            if (r) this.loadPersonalStats(true);
          })
        );
      } catch (e) {}
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async loadPersonalStats(suppressToast = false): Promise<void> {
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
      
      console.info('personal-dashboard: raw personalStats payload', this.personalStats);

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

    // Manejo adicional: varias APIs pueden devolver conteos con nombres distintos
    const pickFirstNumber = (candidates: string[]) => {
      for (const n of candidates) {
        if (n in stats && stats[n] != null) return toNum(stats[n]);
        if (stats[n] === 0) return 0;
      }
      return null;
    };

    // Si `productos` viene como número o array, priorizarlo
    if (out.productos == null) {
      if (Array.isArray(stats.productos)) {
        out.productos = { cantidadPublicados: stats.productos.length };
      } else if (typeof stats.productos === 'number') {
        out.productos = { cantidadPublicados: stats.productos };
      }
    }

    // Variantes comunes en inglés/español para total de productos
    const totalProductsCandidate = pickFirstNumber([
      'total_products', 'totalProducts', 'total_products_count', 'total_products_total',
      'total_products_total_count', 'totalProductos', 'total_productos', 'total_productos'
    ]);
    if (totalProductsCandidate != null && out.productos_creados == null) {
      out.productos_creados = totalProductsCandidate;
    }

    // Productos disponibles variantes
    const productosDisponiblesCandidate = pickFirstNumber([
      'productos_disponibles', 'productosDisponibles', 'available_products', 'availableProducts', 'cantidad_disponibles', 'cantidadDisponibles'
    ]);
    if (productosDisponiblesCandidate != null && out.productos_disponibles == null) {
      out.productos_disponibles = productosDisponiblesCandidate;
    }

    // Productos solicitados por usuario variantes
    const productosSolicitadosCandidate = pickFirstNumber([
      'productos_solicitados', 'requested_products', 'productos_solicitados_por_usuario', 'productosSolicitados', 'cantidadSolicitadas', 'cantidad_solicitadas'
    ]);
    if (productosSolicitadosCandidate != null && out.productos_solicitados_por_usuario == null) {
      out.productos_solicitados_por_usuario = productosSolicitadosCandidate;
    }

    // Mensajes enviados / totales variantes
    const mensajesCandidate = pickFirstNumber([
      'mensajes_enviados', 'mensajesEnviados', 'total_mensajes', 'totalMensajes', 'messages_total', 'total_messages', 'messages'
    ]);
    if (mensajesCandidate != null && out.mensajes_enviados == null) {
      out.mensajes_enviados = mensajesCandidate;
    }

    // Solicitudes / requests variantes
    const solicitudesCandidate = pickFirstNumber([
      'total_requests', 'totalRequests', 'total_requests_count', 'total_solicitudes', 'solicitudes_total', 'solicitudes', 'requests_total'
    ]);
    if (solicitudesCandidate != null && out.total_requests == null) {
      out.total_requests = solicitudesCandidate;
    }

    // Proyectos variantes
    const proyectosCandidate = pickFirstNumber([
      'total_proyectos', 'totalProjects', 'total_proyectos_count', 'proyectos_total', 'total_projects'
    ]);
    if (proyectosCandidate != null && out.total_proyectos == null) {
      out.total_proyectos = proyectosCandidate;
    }

    // Usuarios variantes
    const usuariosCandidate = pickFirstNumber([
      'total_usuarios', 'totalUsers', 'total_users', 'users_total', 'usuarios_total'
    ]);
    if (usuariosCandidate != null && out.total_usuarios == null) {
      out.total_usuarios = usuariosCandidate;
    }

    // Donaciones variantes
    const donationsCandidate = pickFirstNumber([
      'total_donations', 'totalDonations', 'donaciones_totales', 'donaciones_total', 'total_donaciones'
    ]);
    if (donationsCandidate != null && out.total_donations == null) {
      out.total_donations = donationsCandidate;
    }

    // Notificaciones no leídas - fallback
    const notifsCandidate = pickFirstNumber([
      'notificaciones_no_leidas', 'notificacionesNoLeidas', 'unread_notifications', 'unread_notifications_count', 'notificaciones'
    ]);
    if (notifsCandidate != null && out.notificaciones_no_leidas == null) {
      out.notificaciones_no_leidas = notifsCandidate;
    }
    // productos_creados
    if (out.productos_creados == null) {
      if (stats.productos && typeof stats.productos === 'object') {
        if ('cantidadPublicados' in stats.productos) out.productos_creados = toNum(stats.productos.cantidadPublicados);
        else if ('cantidad_publicados' in stats.productos) out.productos_creados = toNum(stats.productos.cantidad_publicados);
        else if ('cantidadPublicadosTotal' in stats.productos) out.productos_creados = toNum(stats.productos.cantidadPublicadosTotal);
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
      }
    } else {
      out.productos_disponibles = toNum(out.productos_disponibles);
    }

    // productos_solicitados_por_usuario
    if (out.productos_solicitados_por_usuario == null) {
      if (stats.solicitudes && typeof stats.solicitudes === 'object') {
        if ('realizadas' in stats.solicitudes) out.productos_solicitados_por_usuario = toNum(stats.solicitudes.realizadas);
        else if ('cantidad' in stats.solicitudes) out.productos_solicitados_por_usuario = toNum(stats.solicitudes.cantidad);
      }
      if (out.productos_solicitados_por_usuario == null && stats.productos && typeof stats.productos === 'object' && 'cantidadSolicitadas' in stats.productos) {
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
      if (out.mensajes_enviados == null && 'total_mensajes' in stats) out.mensajes_enviados = toNum(stats.total_mensajes);
    } else {
      out.mensajes_enviados = toNum(out.mensajes_enviados);
    }

    // notificaciones_no_leidas
    if (out.notificaciones_no_leidas == null) {
      if (stats.notificaciones && typeof stats.notificaciones === 'object') {
        if ('noLeidas' in stats.notificaciones) out.notificaciones_no_leidas = toNum(stats.notificaciones.noLeidas);
        else if ('no_leidas' in stats.notificaciones) out.notificaciones_no_leidas = toNum(stats.notificaciones.no_leidas);
      }
      if (out.notificaciones_no_leidas == null && typeof stats.notificaciones === 'number') out.notificaciones_no_leidas = toNum(stats.notificaciones);
    } else {
      out.notificaciones_no_leidas = toNum(out.notificaciones_no_leidas);
    }

    return out;
  }

  goBack(): void {
    this.router.navigate(['/principal']);
  }
}

