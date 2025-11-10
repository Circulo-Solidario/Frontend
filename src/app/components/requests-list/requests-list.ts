import { Component, inject, OnInit } from '@angular/core';
import { ScrollTop } from 'primeng/scrolltop';
import { LoginService } from '../../services/login';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { Requests } from '../../services/requests';
import { Toasts } from '../../services/toasts';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Notifications, TipoNotificaciones } from '../../services/notifications';

@Component({
  selector: 'app-requests-list',
  imports: [
    ScrollTop,
    TabsModule,
    AccordionModule,
    AvatarModule,
    BadgeModule,
    DataViewModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './requests-list.html',
  styleUrl: './requests-list.css',
})
export class RequestsList implements OnInit {
  private loginService: LoginService = inject(LoginService);
  private requestService: Requests = inject(Requests);
  private notificationService: Notifications = inject(Notifications)
  private router: Router = inject(Router);  
  private toasts: Toasts = inject(Toasts);

  logedUser: any;
  defaultTab: string = '0';
  myRequests: any[] = [];
  requestOfProducts: any[] = [];

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
      }
      this.getMyRequests();
      this.getRequestsOfMyProducts();
    });
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

  getMyRequests() {
    this.requestService.getRequestsFrom(this.logedUser?.id, null).subscribe({
      next: (response: any) => {
        this.myRequests = response;       
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al obtener tus solicitudes',
          detail: 'No pudimos obtener tus solicitudes, intente nuevamente...',
        });
      },
    });
  }

  getRequestsOfMyProducts() {
    this.requestService.getRequestsFrom(null, this.logedUser?.id).subscribe({
      next: (response: any) => {
        this.requestOfProducts = response.reduce((acum: any[], actual: any) => {
          const productId = actual.producto.id;

          let group = acum.find((g) => g.product.id === productId);

          if (!group) {
            group = {
              product: actual.producto,
              requests: [],
            };
            acum.push(group);
          }

          group.requests.push({
            id: actual.id,
            fromUser: actual.solicitante,
            toUser: actual.donador,
            message: actual.mensaje,
            requestDate: actual.fechaSolicitud,
            requestState: actual.estadoSolicitud,
          });

          return acum;
        }, []);        
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al obtener las solicitudes de tus productos',
          detail: 'No pudimos obtener las solicitudes de tus productos, intente nuevamente...',
        });
      },
    });
  }

  deleteRequest(request: any){
    this.requestService.deleteRequest(request.id).subscribe({
      next: () => {
        this.toasts.showToast({
          severity: 'success', summary: 'Solicitud eliminada', detail: 'La solicitud ha sido eliminada correctamente.'
        });
        this.myRequests = this.myRequests.filter(requestList => requestList.id !== request.id);
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al eliminar la solicitud', detail: 'No pudimos eliminar la solicitud, intente nuevamente...'
        });
      }
    });
  }

  aceptRequest(request: any, product:any){
    this.requestService.updateRequestState(request.id, 'ACEPTADA').subscribe({
      next: () => {
        this.toasts.showToast({
          severity: 'success', summary: 'Solicitud aceptada', detail: 'La solicitud ha sido aceptada correctamente.'
        });
        this.getRequestsOfMyProducts(); 
        this.notificationService.sendNotification({
          deUsuario: request.toUser.id,
          ausuario: request.fromUser.id,
          tipoNotificacion: TipoNotificaciones.SOLICITUD_ACEPTADA,
          mensaje: `Tu solicitud para el producto ${product.nombre} ha sido aceptada.`
        }).subscribe({
          next: () => {}
        });
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al aceptar la solicitud', detail: 'No pudimos aceptar la solicitud, intente nuevamnte...'
        });
      }
    });
  }

  declineRequest(request: any){
    this.requestService.updateRequestState(request.id, 'RECHAZADA').subscribe({
      next: () => {
        this.toasts.showToast({
          severity: 'success', summary: 'Solicitud rechazada', detail: 'La solicitud ha sido rechazada correctamente.'
        });
        this.getRequestsOfMyProducts(); 
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al rechazar la solicitud', detail: 'No pudimos rechazar la solicitud, intente nuevamnte...'
        });
      }
    });
  }
}
