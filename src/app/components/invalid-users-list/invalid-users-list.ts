import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Tag, TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Toasts } from '../../services/toasts';
import { LoginService } from '../../services/login';
import { PermissionsService } from '../../services/permissions';
import { Users } from '../../services/users';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-invalid-users-list',
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    ButtonModule,
    PanelModule,
    SelectModule,
    SliderModule,
    ScrollTopModule,
    ProgressSpinnerModule,
    TextareaModule,
    InputTextModule,
    ConfirmDialogModule,
    CardModule,
    TagModule
  ],
  providers: [ConfirmationService],
  templateUrl: './invalid-users-list.html',
  styleUrl: './invalid-users-list.css'
})
export class InvalidUsersList {
  @ViewChild('dataView') dataView: any;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private router: Router = inject(Router);
  private toasts: Toasts = inject(Toasts);
  private loginService: LoginService = inject(LoginService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private userService: Users = inject(Users);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  logedUser: any;
  organizations: any = [];

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
        return;
      }

      //Validación de permisos para acceder a esta ruta
      if (!this.permissionsService.canAccessRoute(user, this.router.url)) {
        this.router.navigate(['/principal']);
        return;
      }

      this.getInvalidOrganizations();
    });
  }

  getInvalidOrganizations() {
    // Obtener organizaciones no validadas
    this.userService.getFilteredUsers(false, 'ORGANIZACION').subscribe({
      next: (response: any) => {
        this.organizations = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al obtener organizaciones',
          detail: 'No pudimos obtener las organizaciones no validadas, intente nuevamente...'
        });
      }
    });
  }

  hasDocument(org: any): boolean {
    return org.documentos && org.documentos.length > 0;
  }

  getDocument(org: any): any {
    return org.documentos && org.documentos.length > 0 ? org.documentos[0] : null;
  }

  getEstadoSeverity(estado: string): 'info' | 'warn' | 'danger' | 'success' | 'secondary' {
    switch (estado) {
      case 'PENDIENTE':
        return 'info';
      case 'RECHAZADO':
      case 'RECHAZADO_VISTO':
        return 'danger';
      case 'VALIDADO':
        return 'success';
      case 'SIN_DOCUMENTO':
        return 'secondary';
      default:
        return 'info';
    }
  }

  isButtonsDisabled(org: any): boolean {
    return org.estado === 'RECHAZADO' || org.estado === 'RECHAZADO_VISTO';
  }

  downloadDocument(orgId: number) {
    const org = this.organizations.find((o: any) => o.id === orgId);
    const document = org ? this.getDocument(org) : null;
    
    if (!document) {
      this.toasts.showToast({
        severity: 'warn',
        summary: 'Sin documento',
        detail: 'No hay documento disponible para descargar'
      });
      return;
    }

    this.userService.downloadDocument(orgId, document.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = document.nombre || 'documento.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar documento:', error);
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al descargar',
          detail: 'No se pudo descargar el documento'
        });
      }
    });
  }

  viewDocument(orgId: number) {
    const org = this.organizations.find((o: any) => o.id === orgId);
    const document = org ? this.getDocument(org) : null;
    
    if (!document) {
      this.toasts.showToast({
        severity: 'warn',
        summary: 'Sin documento',
        detail: 'No hay documento disponible para visualizar'
      });
      return;
    }

    this.userService.downloadDocument(orgId, document.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      },
      error: (error) => {
        console.error('Error al visualizar documento:', error);
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al visualizar',
          detail: 'No se pudo visualizar el documento'
        });
      }
    });
  }

  validateOrganization(event: Event, orgId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de validar esta organización?',
      header: 'Validar organización',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Validar',
      },
      accept: () => {
        this.userService.validateUser(orgId, 'VALIDADO').subscribe({
          next: () => {
            this.toasts.showToast({
              severity: 'success',
              summary: 'Organización validada',
              detail: 'Se validó correctamente la organización'
            });
            this.getInvalidOrganizations();
          },
          error: () => {
            this.toasts.showToast({
              severity: 'error',
              summary: 'Error al validar',
              detail: 'Error al validar la organización, intente nuevamente...'
            });
          }
        });
      },
      reject: () => {
      },
    });
  }

  rejectOrganization(event: Event, orgId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de rechazar esta organización?',
      header: 'Rechazar organización',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Rechazar',
        severity: 'danger',
      },
      accept: () => {
        this.userService.validateUser(orgId, 'RECHAZADO').subscribe({
          next: () => {
            this.toasts.showToast({
              severity: 'success',
              summary: 'Organización rechazada',
              detail: 'Se rechazó correctamente la organización'
            });
            this.getInvalidOrganizations();
          },
          error: () => {
            this.toasts.showToast({
              severity: 'error',
              summary: 'Error al rechazar',
              detail: 'Error al rechazar la organización, intente nuevamente...'
            });
          }
        });
      },
      reject: () => {
      },
    });
  }

  goHome() {
    this.router.navigate(['/principal']);
  }
}
