import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Products } from '../../services/products';
import { Toasts } from '../../services/toasts';
import { Users } from '../../services/users';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { Tag } from 'primeng/tag';
import { LoginService } from '../../services/login';
import { Requests } from '../../services/requests';
import { Notifications, TipoNotificaciones } from '../../services/notifications';

@Component({
  selector: 'app-product-detail',
  imports: [
    Button,
    Avatar,
    Badge,
    Tag
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private router: Router = inject(Router);
  private productService: Products = inject(Products);
  private userService: Users = inject(Users);
  private toasts: Toasts = inject(Toasts);
  private loginService: LoginService = inject(LoginService);
  private requestService: Requests = inject(Requests);
  private notificationService: Notifications = inject(Notifications);
  id: any;
  filters: any;
  productData: any;
  donorData: any;
  logedUser: any;

  async ngOnInit(): Promise<void> {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
      }
    });
    const navigation = this.router.currentNavigation();
    const state = navigation?.extras?.state || history.state;
    this.id = state?.['id'];
    this.filters = state?.['filters'];
    try {
      await this.getProductData();
      await this.getDonorData();
    }catch(error){
      this.toasts.showToast({
        severity: 'error', summary: 'Error al obtener datos', detail: 'Error al obtener datos, intente nuevamente,,,'
      })
    }    
  }

  async getProductData(): Promise<void> {
    this.productData = await firstValueFrom(this.productService.getProductDetail(this.id));
  }

  async getDonorData(): Promise<void> {
    this.donorData = await firstValueFrom(this.userService.getUserInfoId(this.productData.idUsuario));
  }

  searchRequest(): boolean{
    if(this.productData.solicitantes.find((s: any) => s.id == this.logedUser.id)){
      return true;
    }
    return false;
  }

  getSeverity(product: any): 'success' | 'warn' | 'danger' {
    switch (product.estado) {
      case 'DISPONIBLE':
        return 'success';
      case 'SOLICITADO':
        return 'warn';
      case 'RESERVADO':
        return 'danger';
      case 'ENTREGADO':
        return 'danger';
      default:
        return 'success';
    }
  }

  requestProduct(): void {
    this.requestService.requestProduct({
      deUsuario: this.logedUser.id,
      idProducto: this.productData.id,
      ausuario: this.productData.idUsuario
    }).subscribe({
      next: () => {
        this.toasts.showToast({
          severity: 'success', summary: 'Producto solicitado!', detail: 'Notificamos al donante sobre tu solicitud'
        });
        this.notificationService.sendNotification({
                    tipoNotificacion: TipoNotificaciones.NUEVA_SOLICITUD,
                    deUsuario: this.logedUser.id,
                    ausuario: this.productData.idUsuario,
                    mensaje: `Tienes una nueva solicitud del producto ${this.productData.nombre} desde el usuario ${this.logedUser.alias}`
                  }).subscribe();
        this.getProductData();
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al solicitar producto', detail: 'No pudimos procesar tu solicitud, intente nuevamente...'
        })
      }
    });
  }

  goBack() {
    this.router.navigate(['/principal/busqueda'], {
      queryParams: { nombre: this.filters.nombre, categoria: this.filters.categoriaId, distancia: this.filters.distancia }
    });
  }
}
