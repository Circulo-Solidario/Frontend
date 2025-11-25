import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { CommonModule } from '@angular/common';
import { TieredMenu } from 'primeng/tieredmenu';
import { AccordionModule } from 'primeng/accordion';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Avatar } from 'primeng/avatar';
import { OverlayBadge } from 'primeng/overlaybadge';
import { Popover } from 'primeng/popover';
import { Menu } from 'primeng/menu';
import { LoginService } from '../../services/login';
import { Badge } from 'primeng/badge';
import { ScrollTopModule } from 'primeng/scrolltop';
import { FormsModule } from '@angular/forms';
import { Subscription, firstValueFrom } from 'rxjs';
import { NotificationInter, Notifications } from '../../services/notifications';
import { Users } from '../../services/users';
import { Toasts } from '../../services/toasts';
// Chart.js integration commented out per user request (do not remove)
// import Chart from 'chart.js/auto';
import { Statistics } from '../../services/statistics';

@Component({
  selector: 'app-home',
  imports: [
    Toolbar,
    Button,
    IconField,
    InputIcon,
    InputText,
    RouterOutlet,
    PanelMenu,
    Drawer,
    ThemeSwitcher,
    CommonModule,
    TieredMenu,
    Avatar,
    AccordionModule,
    DialogModule,
    OverlayBadge,
    Popover,
    Menu,
    Badge,
    FormsModule,
    ScrollTopModule,
    
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('op') op!: Popover;
  @ViewChild('tieredMenu') tieredMenu!: TieredMenu;
  @ViewChild('notificationContent') set notificationContentRef(
    el: ElementRef<HTMLDivElement> | undefined
  ) {
    if (el) {
      this.notificationContent = el;
      this.initResizeObserver();
    }
  }
  private loginService: LoginService = inject(LoginService);
  private router: Router = inject(Router);
  private notificationService: Notifications = inject(Notifications);
  private userService: Users = inject(Users);
  private toastService: Toasts = inject(Toasts);
  private statisticsService: Statistics = inject(Statistics);
  private notificationsSubscription?: Subscription;
  private resizeObserver!: ResizeObserver;
  loggedUser: any;
  isCollapsed = false;
  fullyCollapsed = false;
  rotate = false;
  visible = false;
  showTerms: boolean = false;
  showFAQs: boolean = false;
  canSearchProducts: boolean = false;
  validationDialogVisible: boolean = false;
  validationDialogTitle: string = '';
  validationDialogMessage: string = '';
  validationDialogType: 'RECHAZADO' | 'PENDIENTE' | 'VALIDADO' | null = null;

  faqs: { question: string; answer: string }[] = [
    {
      question: '¿Qué es Círculo Solidario?',
      answer:
        'Círculo Solidario es una plataforma para publicar, ofrecer y solicitar donaciones de productos y proyectos solidarios. Conectamos a donantes con personas y organizaciones que necesitan recursos.',
    },
    {
      question: '¿Cómo creo una publicación para donar un producto?',
      answer:
        'En el apartado "Productos" vas a encontrar la opcion "Publicar producto", elige fotos claras, agrega una descripción honesta del producto, y especifica su categoria y estado. Revisa y publica cuando estés listo.',
    },
    {
      question: '¿Cómo solicito un producto?',
      answer:
        'Desde la página en el buscador de arriba escribe el producto que necesites y si encuentras resultados podras solicitar un producto. El donante recibirá una notificación y podrá aceptar o rechazar tu solicitud, donde podran mediante un chat coordinar la entrega del producto.',
    },
    {
      question: '¿Puedo publicar proyectos para recibir donaciones?',
      answer:
        'Sí eres una organizacion y estas necesitando una donacion monetaria. En "Proyectos solidarios" puedes crear un proyecto con objetivo y detalles de cómo se utilizarán las donaciones; los usuarios podrán donar recursos o colaborar según lo indicado.',
    },
    {
      question: '¿Hay algún costo por usar la plataforma?',
      answer:
        'Usar Círculo Solidario para publicar y solicitar productos es gratuito. Si un proyecto solicita donaciones monetarias, los términos y comisiones (si hubiera) quedarán indicados claramente en ese proyecto.',
    },
    {
      question: '¿Cómo puedo contactar al soporte?',
      answer:
        'Puedes contactarnos a través del correo 405865@tecnicatura.frc.utn.edu.ar o 113114@tecnicatura.frc.utn.edu.ar. Intentamos responder en un plazo razonable.',
    },
    {
      question: '¿Qué debo hacer si hay un problema con una donación?',
      answer:
        'Primero intenta resolverlo directamente con la otra parte por chat. Si no se soluciona, repórtalo al equipo de soporte con detalles y pruebas; nosotros te orientaremos para medir el siguiente paso.',
    },
  ];
  expandedFaqs: boolean[] = [];
  productName: string = '';
  menu: MenuItem[] = [];
  userMenu: MenuItem[] = [];
  notifications: NotificationInter[] = [];
  unreadCount: number = 0;
  showNotifications: boolean = false;
  globalStats: any = null;
  showGlobalStatsDialog: boolean = false; 
  showGlobalStatsPanel: boolean = false;
  globalStatsEntries: Array<{ key: string; value: any; label?: string; sanitizedKey?: string }> = [];
  chartDataMap: Record<string, any> = {};
  chartOptionsMap: Record<string, any> = {};
  chartTypeMap: Record<string, any> = {};
  chartInstances: Record<string, any> = {};
  groupedStats: Record<string, Array<{ key: string; value: any; label?: string; sanitizedKey?: string }>> = {};
  groupedStatsKeys: string[] = [];

  // Chart-related runtime is currently disabled (commented).
  // If you want to re-enable charts, uncomment Chart import above and
  // the methods `createChart` / `destroyAllCharts` below. Keeping
  // the data structures in place so nothing is removed.
  hasOverflow = false;
  notificationContent!: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.loggedUser = user;
      if (this.loggedUser == null) {
        this.router.navigate(['/login']);
        return;
      }
      this.getNotificationsHistory();
      this.subscribeNotifications();
      this.setMenu();
      this.checkOrganizationValidationStatus();
    });
    this.userMenu = [];
    // No mostrar 'Perfil' para administradores
    if (this.loggedUser?.tipoUsuario !== 'ADMINISTRADOR') {
      this.userMenu.push({
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: '/principal/editar-perfil',
      });
    }
    this.userMenu.push({
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logOut();
      },
    });
    this.expandedFaqs = this.faqs.map(() => false);   
  }

  setMenu(){
    // Definir todos los elementos de menú disponibles
    const allMenuItems = {
      productos: {
        label: 'Productos',
        icon: 'pi pi-gift',
        id: 'homeProducts',
        items: [
          {
            id: 'subProductsPublish',
            label: 'Publicar producto',
            icon: 'pi pi-plus',
            command: () => {
              this.router.navigate(['/principal/publicar-producto']);
              this.visible = false;
            },
          },
          {
            id: 'subProductsMyPosts',
            label: 'Mis publicaciones',
            icon: 'pi pi-list',
            command: () => {
              this.router.navigate(['/principal/mis-publicaciones']);
              this.visible = false;
            },
          },
          {
            id: 'subProductsViewRequests',
            label: 'Ver solicitudes',
            icon: 'pi pi-comments',
            command: () => {
              this.router.navigate(['/principal/solicitudes']);
              this.visible = false;
            },
          },
        ],
      },
      chats: {
        label: 'Chats',
        icon: 'pi pi-comments',
        id: 'homeChats',
        command: () => {
          this.router.navigate(['/principal/chats']);
          this.visible = false;
        },
      },
      donaciones: {
        label: 'Donaciones',
        icon: 'pi pi-heart',
        id: 'homeDonations',
        items: [
          {
            id: 'subDonationsSolidarityProjects',
            label: 'Proyectos solidarios',
            icon: 'pi pi-list',
            command: () => {
              this.router.navigate(['/principal/proyectos']);
              this.visible = false;
            },
          },
          {
            id: 'subDonationsPublishProject',
            label: 'Publicar proyecto',
            icon: 'pi pi-plus',
            command: () => {
              this.router.navigate(['/principal/crear-proyecto']);
              this.visible = false;
            },
          },
          {
            id: 'subDonationsMyProjects',
            label: 'Mis proyectos publicados',
            icon: 'pi pi-list',
            command: () => {
              this.router.navigate(['/principal/mis-proyectos']);
              this.visible = false;
            },
          }
        ],
      },
      personasCalle: {
        label: 'Personas en situación de calle',
        icon: 'pi pi-map',
        id: 'homeStreetPeople',
        command: () => {
          this.router.navigate(['/principal/mapa']);
          this.visible = false;
        }
      },
      reportes: {
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        id: 'homeReports',
        items: [
          {
            id: 'subReportsMyStats',
            label: 'Mis estadísticas',
            icon: 'pi pi-chart-scatter',
            command: () => {
              this.router.navigate(['/principal/dashboard-personal']);
              this.visible = false;
            },
          },
          {
            id: 'subReportsGlobalStats',
            label: 'Estadísticas globales',
            icon: 'pi pi-chart-line',
            command: () => {
              this.showGlobalStats();
              this.visible = false;
            },
          },
        ],
      },
      panelAdmin: {
        label: 'Organizaciones a validar',
        icon: 'pi pi-shield',
        id: 'homeAdminOrgPanel',
        command: () => {
          this.router.navigate(['/principal/validar-organizaciones']);
          this.visible = false;
        }
      }
    };

    const userType = this.loggedUser?.tipoUsuario;
    const userRoles = this.loggedUser?.roles || [];
    const valid = this.loggedUser?.validado;
    
    this.menu = [];

    if (userType === 'ORGANIZACION' && valid) {
      this.canSearchProducts = false;
      this.menu = [
        {
          ...allMenuItems.donaciones,
          items: [
            allMenuItems.donaciones.items![0], // Proyectos solidarios
            allMenuItems.donaciones.items![1], // Publicar proyecto  
            allMenuItems.donaciones.items![2], // Mis proyectos publicados
          ]
        },
        {...allMenuItems.personasCalle} // Personas en situación de calle
      ];
    } else if (userType === 'USUARIO') {
      // Usuarios con roles específicos
      const roleIds = userRoles.map((role: any) => role.id);
      const hasRole = (id: number) => roleIds.includes(id);
      if(!hasRole(3)){
        this.canSearchProducts = false;
      }
      // DONANTE (id: 2)
      if (hasRole(2)) {
        // Productos completo
        this.menu.push({...allMenuItems.productos});
        // Chats
        this.menu.push({...allMenuItems.chats});
        // Personas en situación de calle
        // Reportes
        this.menu.push({...allMenuItems.reportes});
        // Donaciones solo con Proyectos solidarios
        this.menu.push({
          ...allMenuItems.donaciones,
          items: [allMenuItems.donaciones.items![0]] // Solo Proyectos solidarios
        });
      }
      
      // DONATARIO (id: 3)
      if (hasRole(3)) {
        this.canSearchProducts = true;
        // Productos solo con Ver solicitudes
        const productosExiste = this.menu.find(item => item.id === 'homeProducts');
        if (productosExiste) {
          // Si ya existe productos (por rol DONANTE), agregar Ver solicitudes si no está
          if (!productosExiste.items?.find(item => item.id === 'subProductsViewRequests')) {
            productosExiste.items?.push(allMenuItems.productos.items![2]);
          }
        } else {
          // Si no existe, crear productos solo con Ver solicitudes
          this.menu.push({
            ...allMenuItems.productos,
            items: [allMenuItems.productos.items![2]] // Solo Ver solicitudes
          });
        }
        
        // Agregar otros menús si no existen
        if (!this.menu.find(item => item.id === 'homeChats')) {
          this.menu.push({...allMenuItems.chats});
        }
        if (!this.menu.find(item => item.id === 'homeReports')) {
          this.menu.push({...allMenuItems.reportes});
        }
        if (!this.menu.find(item => item.id === 'homeDonations')) {
          this.menu.push({
            ...allMenuItems.donaciones,
            items: [allMenuItems.donaciones.items![0]] // Solo Proyectos solidarios
          });
        }
      }
      
      // VOLUNTARIO OBSERVADOR (id: 4)
      if (hasRole(4)) {
        // Solo agregar si no existen ya
        if (!this.menu.find(item => item.id === 'homeStreetPeople')) {
          this.menu.push({...allMenuItems.personasCalle});
        }
        if (!this.menu.find(item => item.id === 'homeReports')) {
          this.menu.push({...allMenuItems.reportes});
        }
        if (!this.menu.find(item => item.id === 'homeDonations')) {
          this.menu.push({
            ...allMenuItems.donaciones,
            items: [allMenuItems.donaciones.items![0]] // Solo Proyectos solidarios
          });
        }
      }
    } else if (userType === 'ADMINISTRADOR') {
      // Admin tiene acceso a todo
      this.menu = [
        allMenuItems.panelAdmin
      ];
      allMenuItems.personasCalle.label = 'Supervisar puntos en el mapa';
      this.menu.push(allMenuItems.personasCalle);
    }
  }

  ngOnDestroy() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    try {
      this.notificationService.disconnect();
    } catch (e) {
      // Ignorar errores de desconexión
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.destroyAllCharts();
  }

  closeGlobalStats(): void {
    this.showGlobalStatsPanel = false;
    this.destroyAllCharts();
  }

  private labelMap: Record<string, string> = {
    total_users: 'Usuarios totales',
    total_products: 'Productos totales',
    total_requests: 'Solicitudes totales',
  };

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

  private colorPalette = [
    '#4f46e5', // indigo
    '#059669', // emerald
    '#d97706', // amber
    '#ef4444', // red
    '#0ea5e9', // sky
    '#a78bfa', // violet
  ];

  private getColorForKey(key: string, index = 0) {
    const hash = Array.from(key).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return this.colorPalette[(hash + index) % this.colorPalette.length];
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

  initResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => this.checkOverflow());
    this.resizeObserver.observe(this.notificationContent.nativeElement);
    this.checkOverflow();
  }

  ngAfterViewInit() {
    this.checkOverflow();
    this.resizeObserver = new ResizeObserver(() => this.checkOverflow());
    if (this.notificationContent) {
      this.resizeObserver.observe(this.notificationContent.nativeElement);
    }
  }

  checkOverflow() {
    if (!this.notificationContent) return;
    const el = this.notificationContent.nativeElement;
    this.hasOverflow = el.scrollHeight > el.clientHeight;
  }

  toggleSidebar() {
    this.rotate = true;
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      setTimeout(() => {
        this.fullyCollapsed = true;
      }, 225);
    } else {
      this.fullyCollapsed = false;
    }
    setTimeout(() => {
      this.rotate = false;
    }, 500);
  }

  goHome() {
    this.router.navigate(['/principal']);
    this.visible = false;
  }

  goEditProfile() {
    this.router.navigate(['/principal/editar-perfil']);
    this.visible = false;
  }

  logOut() {
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }

  searchProduct(key: KeyboardEvent) {
    if (key.key != 'Enter' || this.productName == '') {
      return;
    }
    this.router.navigate(['/principal/busqueda'], {
      queryParams: { nombre: this.productName },
    });
    this.productName = '';
  }

  getNotificationsHistory() {
    if (!this.loggedUser || !this.loggedUser.id) {
      this.notifications = [];
      this.unreadCount = 0;
      return;
    }

    this.notificationService.getNotifications(this.loggedUser.id).subscribe({
      next: (notifications) => {
        if (notifications) {
          this.notifications = notifications;
          this.unreadCount = this.notifications.filter(
            (notification) => notification.fechaVistaNotificacion == null
          ).length;
          this.orderNotificationsByDate();
        } else {
          this.notifications = [];
        }
      },
      error: () => {
        console.log('Error al obtener historial de notificaciones...');
      },
    });
  }

  orderNotificationsByDate() {
    this.notifications.sort((a: NotificationInter, b: NotificationInter) => {
      const dateA = new Date(a.fechaNotificacion!).getTime();
      const dateB = new Date(b.fechaNotificacion!).getTime();
      return dateB - dateA;
    });
  }

  subscribeNotifications() {
    if (!this.loggedUser || !this.loggedUser.id) {
      return;
    }

    this.notificationService.subscribeNotification('nn-' + this.loggedUser.id);

    this.notificationsSubscription = this.notificationService.notification$.subscribe({
      next: (notification: NotificationInter) => {
        if (notification && notification.mensaje && !this.notifications.includes(notification)) {
          this.notifications.push(notification);
          if (!notification.fechaVistaNotificacion) this.unreadCount++;
          this.orderNotificationsByDate();
        }
      },
      error: (error) => {
        console.log('Error recibiendo notificaciones...', error);
      },
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    // if (!this.showNotifications) {
    //   this.markAllAsRead();
    // }
  }

  markAsRead(notification: NotificationInter): void {
    this.notificationService.markReadNotification(notification.id!).subscribe({
      next: () => {
        notification.fechaVistaNotificacion = new Date().toISOString();
        this.unreadCount > 0 ? this.unreadCount-- : 0;
      },
      error: () => {
        console.log('Error marcando notificación como leída...');
      },
    });
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      if (!notification.fechaVistaNotificacion && notification.id) {
        this.markAsRead(notification);
        notification.fechaVistaNotificacion = new Date().toISOString();
      }
    });
    this.unreadCount = 0;
  }

  async reloadNotifications() {
    await this.notificationService.unsubscribeAllNotification();
    this.getNotificationsHistory();
    this.subscribeNotifications();
  }

  openTerms(): void {
    this.showTerms = true;
    this.visible = false;
  }

  closeTerms(): void {
    this.showTerms = false;
  }

  openFaqs(): void {
    this.showFAQs = true;
    this.visible = false;
  }

  closeFaqs(): void {
    this.showFAQs = false;
  }
 
  toggleFaq(index: number): void {
    this.expandedFaqs[index] = !this.expandedFaqs[index];
  }

  toggleFaqs(): void {
    this.showFAQs = !this.showFAQs;
    if (this.showFAQs) this.visible = false;
  }

  toggleMenuItem(item: any): void {
    if (item.items && item.items.length > 0) {
      // Toggle del item actual
      const wasExpanded = item.expanded;
      item.expanded = !item.expanded;
      
      this.menu.forEach((menuItem: any) => {
        if (menuItem !== item && menuItem.items) {
          menuItem.expanded = false;
        }
      });
      
      if (wasExpanded && !this.menu.some(menuItem => menuItem.expanded && menuItem !== item)) {
        item.expanded = false;
      }
    } else {
      if (item.command) {
        item.command();
      }
    }
  }

  onTieredMenuHide(): void {
    this.menu.forEach((menuItem: any) => {
      if (menuItem.items) {
        menuItem.expanded = false;
      }
    });
  }

  checkOrganizationValidationStatus(): void {
    // Solo mostrar diálogo si es organización y tiene estado definido
    if (this.loggedUser?.tipoUsuario !== 'ORGANIZACION' || !this.loggedUser?.estado) {
      return;
    }

    const estado = this.loggedUser.estado;

    if (estado === 'RECHAZADO') {
      this.validationDialogType = 'RECHAZADO';
      this.validationDialogTitle = 'Solicitud Rechazada';
      this.validationDialogMessage = 'Se rechazó la validación de tu organización, por favor actualiza los documentos desde tu perfil para iniciar una nueva solicitud';
      this.validationDialogVisible = true;
    } else if (estado === 'PENDIENTE') {
      this.validationDialogType = 'PENDIENTE';
      this.validationDialogTitle = 'Solicitud Pendiente';
      this.validationDialogMessage = 'Tu solicitud está pendiente, por el momento no tendrás acceso a ninguna funcionalidad hasta que validemos tu organización';
      this.validationDialogVisible = true;
    } else if (estado === 'VALIDADO') {
      this.validationDialogType = 'VALIDADO';
      this.validationDialogTitle = 'Bienvenido';
      this.validationDialogMessage = 'Hemos validado tu organización, bienvenido a Círculo Solidario';
      this.validationDialogVisible = true;
    }
  }

  async onValidationDialogAccept(): Promise<void> {
    if (!this.validationDialogType) {
      return;
    }

    try {
      let newEstado = '';

      if (this.validationDialogType === 'RECHAZADO') {
        newEstado = 'RECHAZADO_VISTO';
      } else if (this.validationDialogType === 'VALIDADO') {
        newEstado = 'VALIDADO_VISTO';
      }

      if (newEstado) {
        // Llamar al endpoint para cambiar el estado
        await firstValueFrom(this.userService.validateUser(this.loggedUser.id, newEstado));
        
        // Actualizar el usuario en memoria
        this.loggedUser.estado = newEstado;
        
        // Guardar en caché del servicio de login
        this.loginService.setLoggedUser(this.loggedUser);
      }

      this.validationDialogVisible = false;
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      this.toastService.showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el estado'
      });
    }
  }

  async showGlobalStats(): Promise<void> {
    this.showGlobalStatsPanel = true;
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
        this.globalStatsEntries = [
          { key: 'data', sanitizedKey: 'data', label: 'data', value: this.globalStats },
        ];
      }
      this.globalStatsEntries.forEach((entry) => this.buildChartForEntry(entry));
      try {
        console.debug('Global stats entries:', this.globalStatsEntries.map(e => ({ key: e.key, type: typeof e.value, valueSample: e.value && (Array.isArray(e.value) ? e.value.slice(0,3) : (typeof e.value === 'object' ? Object.keys(e.value).slice(0,5) : e.value)) })));
      } catch (e) {}
      // Group entries into categories for display (e.g. Usuarios, Productos, etc.)
      this.groupedStats = {};
      this.globalStatsEntries.forEach((entry) => {
        const group = this.getGroupLabel(entry.key);
        if (!this.groupedStats[group]) this.groupedStats[group] = [];
        this.groupedStats[group].push(entry);
      });
      this.groupedStatsKeys = Object.keys(this.groupedStats);
      // Chart initialization is disabled per user request. Keeping buildChartForEntry
      // so data structures are populated but not used to render canvases.
      console.log('Estadísticas globales cargadas:', this.globalStats);
      this.toastService.showToast({
        severity: 'success',
        summary: 'Estadísticas',
        detail: 'Estadísticas globales cargadas correctamente',
      });
    } catch (error) {
      console.error('Error al obtener estadísticas globales:', error);
      this.toastService.showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron obtener las estadísticas globales',
      });
      this.showGlobalStatsPanel = false;
    }
  }

  private buildChartForEntry(entry: { key: string; value: any; label?: string }) {
    const key = entry.key;
    const v = entry.value;
    delete this.chartDataMap[key];
    delete this.chartOptionsMap[key];
    delete this.chartTypeMap[key];

    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const labels = Object.keys(v);
      const data = labels.map((l) => {
        const val = v[l];
        const num = typeof val === 'number' ? val : Number(val);
        return isNaN(num) ? 0 : num;
      });
      const allZero = data.every((d) => d === 0);
      if (!allZero) {
        const color = this.getColorForKey(key, 0);
        this.chartDataMap[key] = {
          labels,
          datasets: [
            {
              data,
              label: entry.label || this.labelMap[key] || key,
              backgroundColor: labels.map((_, i) => this.getColorForKey(key, i)),
              borderColor: color,
              borderWidth: 1,
            },
          ],
        };
        this.chartTypeMap[key] = 'bar';
        this.chartOptionsMap[key] = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: !!(entry.label || this.labelMap[key]), text: entry.label || this.labelMap[key] || key },
          },
          scales: { y: { beginAtZero: true } },
        };
        return;
      }
    }

    if (Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'number' || !isNaN(Number(x)))) {
      const data = v.map((x: any) => Number(x));
      const labels = data.map((_, i) => `#${i + 1}`);
      const color = this.getColorForKey(key, 0);
      this.chartDataMap[key] = {
        labels,
        datasets: [
          {
            data,
            label: entry.label || this.labelMap[key] || key,
            fill: false,
            borderColor: color,
            backgroundColor: color,
            tension: 0.2,
          },
        ],
      };
      this.chartTypeMap[key] = 'line';
      this.chartOptionsMap[key] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: !!(entry.label || this.labelMap[key]), text: entry.label || this.labelMap[key] || key },
        },
        scales: { x: { display: true }, y: { beginAtZero: true } },
      };
      return;
    }

    if (typeof v === 'number') {
      const num = Number(v);
      const color = this.getColorForKey(key, 0);
      this.chartDataMap[key] = {
        labels: [''],
        datasets: [
          {
            data: [num],
            label: entry.label || this.labelMap[key] || key,
            backgroundColor: [this.getColorForKey(key, 0)],
            borderColor: color,
            borderWidth: 1,
          },
        ],
      };
      this.chartTypeMap[key] = 'bar';
      this.chartOptionsMap[key] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: !!(entry.label || this.labelMap[key]), text: entry.label || this.labelMap[key] || key },
        },
        scales: { y: { beginAtZero: true } },
      };
      return;
    }
  }

  private createChart(sanitizedKey: string, key: string) {
    // Chart runtime disabled: this function intentionally returns immediately.
    return;
  }

  private destroyAllCharts() {
    // Chart cleanup disabled. Keep placeholder to avoid removing code.
    this.chartInstances = {};
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.visible && this.tieredMenu && this.tieredMenu.el) {
      const clickedInsideTieredMenu = this.tieredMenu.el.nativeElement.contains(event.target as Node);
      
      if (!clickedInsideTieredMenu) {
        const hasVisibleSubmenus = this.menu.some((menuItem: any) => menuItem.expanded);
        
        if (hasVisibleSubmenus) {
          setTimeout(() => {
            const tieredMenuElement = this.tieredMenu.el.nativeElement;
            const visibleSubmenus = tieredMenuElement.querySelectorAll('.p-tieredmenu-submenu[style*="block"], .p-tieredmenu-submenu:not([style*="none"])');
            
            if (visibleSubmenus.length === 0) {
              this.menu.forEach((menuItem: any) => {
                if (menuItem.items) {
                  menuItem.expanded = false;
                }
              });
            }
          }, 50);
        }
      }
    }
  }
}
