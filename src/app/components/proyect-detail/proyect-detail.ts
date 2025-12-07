import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Toasts } from '../../services/toasts';
import { LoginService } from '../../services/login';
import { PermissionsService } from '../../services/permissions';
import { Proyects } from '../../services/proyects';
import { Donation } from '../../services/donation';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-proyect-detail',
  imports: [
    ButtonModule,
    AvatarModule,
    BadgeModule,
    TagModule,
    CommonModule,
    FormsModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule
  ],
  providers: [ConfirmationService],
  templateUrl: './proyect-detail.html',
  styleUrl: './proyect-detail.css'
})
export class ProyectDetail implements OnInit {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toasts: Toasts = inject(Toasts);
  private loginService: LoginService = inject(LoginService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private proyectService: Proyects = inject(Proyects);
  private donationService: Donation = inject(Donation);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  id: any;
  filters: any;
  proyectData: any;
  logedUser: any;
  loading = false;
  amount: any;

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
        return;
      }
      
      // Validación de permisos para acceder a esta ruta
      if (!this.permissionsService.canAccessRoute(user, this.router.url)) {
        this.router.navigate(['/principal']);
        return;
      }
    });
    const navigation = this.router.currentNavigation();
    const state = navigation?.extras?.state || history.state;
    if (state?.['id']) {
      this.proyectService.saveIdProyect(state?.['id']);
    }
    this.id = state?.['id'] || localStorage.getItem('proyectId');
    this.filters = state?.['filters'];
    this.getProyectData();
    this.route.queryParams.subscribe((params) => {
      if (params['collection_status'] && params['status'] && params['payment_id']) {
        this.updatefoundig({
          'collection_status': params['collection_status'],
          'status': params['status'],
          'payment_id': params['payment_id']
        });
      }
    });
  }

  updatefoundig(status: any) {
    let payment_id = localStorage.getItem('payment_id') ?? null;
    let donationAmount = localStorage.getItem('donation-amount') ?? null;
    if(!donationAmount){
      return;
    }
    if ((status.collection_status && status.status) == 'approved' && (status.payment_id != payment_id)) {
      this.proyectService.updateFounding(this.id, donationAmount, this.logedUser.id).subscribe({
        next: () => {
          this.confirmationService.confirm({
            key: 'approvedPay',
            rejectButtonProps: {
              label: 'Aceptar',
              variant: 'outlined',
              size: 'small'
            },
            acceptVisible: false,
            reject: () => {
            }
          });
          localStorage.setItem('payment_id', status.payment_id);
          this.getProyectData();
        }
      })
    }
  }

  async donate() {
    this.confirmationService.confirm({
      key: 'donation',
      header: 'Realizar pago a organización',
      rejectButtonProps: {
        label: 'Cancelar',
        icon: 'pi pi-times',
        variant: 'outlined',
        size: 'small'
      },
      acceptVisible: false,
      reject: () => {
      }
    });
    this.loading = true;
    const preferenceId = await this.donationService.createPreference(this.proyectData?.id, this.amount);
    await this.donationService.createPayButton(preferenceId);
    localStorage.setItem('donation-amount', this.amount);
    this.loading = false;
  }

  getProyectData() {
    this.proyectService.getProyect(this.id).subscribe({
      next: (response: any) => {
        this.proyectData = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al obtener detalles del proyecto', detail: 'Error al obtener detalles del proyecto, intente nuevamente...'
        })
      }
    })
  }

  getSeverity(state: any): 'success' | 'warn' | 'danger' {
    switch (state) {
      case 'ACTIVO':
        return 'success';
      case 'CANCELADO':
        return 'danger';
      case 'FINALIZADO_EXITOSO':
        return 'warn';
      case 'FINALIZADO_NO_EXITOSO':
        return 'danger';
      default:
        return 'success';
    }
  }

  goBack() {
    this.router.navigate(['/principal/proyectos'], {
      queryParams: {
        nombre: this.filters?.nombre ?? undefined,
        organizacion: this.filters?.organizacion ?? undefined,
        estado: this.filters?.estado ?? undefined,
      },
    });
  }
}
