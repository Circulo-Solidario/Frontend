import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { Dialog } from 'primeng/dialog';
import { Avatar } from 'primeng/avatar';
import { OverlayBadge } from 'primeng/overlaybadge';
import { Popover } from 'primeng/popover';
import { Menu } from 'primeng/menu';
import { LoginService } from '../../services/login';
import { Badge } from 'primeng/badge';
import { ScrollTopModule } from 'primeng/scrolltop';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationInter, Notifications } from '../../services/notifications';

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
    Dialog,
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
  private notificationsSubscription?: Subscription;
  private resizeObserver!: ResizeObserver;
  loggedUser: any;
  isCollapsed = false;
  fullyCollapsed = false;
  rotate = false;
  visible = false;
  showTerms: boolean = false;
  showFAQs: boolean = false;

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
    });
    this.userMenu = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: '/principal/editar-perfil',
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logOut();
        },
      },
    ];
    this.expandedFaqs = this.faqs.map(() => false);
    this.menu = [
      {
        label: 'Productos',
        icon: 'pi pi-gift',
        id: 'home1',
        items: [
          {
            label: 'Publicar producto',
            icon: 'pi pi-plus',
            command: () => {
              this.router.navigate(['/principal/publicar-producto']);
              this.visible = false;
            },
          },
          {
            label: 'Mis publicaciones',
            icon: 'pi pi-list',
            command: () => {
              this.router.navigate(['/principal/mis-publicaciones']);
              this.visible = false;
            },
          },
          {
            label: 'Ver solicitudes',
            icon: 'pi pi-comments',
            command: () => {
              this.router.navigate(['/principal/solicitudes']);
              this.visible = false;
            },
          },
        ],
      },
      {
        label: 'Chats',
        icon: 'pi pi-comments',
        id: 'home2',
        command: () => {
          this.router.navigate(['/principal/chats']);
          this.visible = false;
        },
      },
      {
        label: 'Donaciones',
        icon: 'pi pi-heart',
        id: 'home3',
        items: [
          {
            label: 'Proyectos solidarios',
            icon: 'pi pi-list',
            command: () => {
              this.router.navigate(['/principal/proyectos']);
              this.visible = false;
            },
          },
          {
            label: 'Publicar proyecto',
            icon: 'pi pi-plus',
            command: () => {
              this.router.navigate(['/principal/crear-proyecto']);
              this.visible = false;
            },
          }
        ],
      },
      {
        label: 'Personas en situación de calle',
        icon: 'pi pi-map',
        id: 'home4',
        command: () => {
          this.router.navigate(['/principal/mapa']);
          this.visible = false;
        }
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        id: 'home5',
        items: [
          {
            label: 'Mis estadísticas',
            icon: 'pi pi-chart-scatter',
          },
          {
            label: 'Estadísticas globales',
            icon: 'pi pi-chart-line',
          },
        ],
      }
    ];
  }

  ngOnDestroy() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    this.notificationService.disconnect();
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
}
