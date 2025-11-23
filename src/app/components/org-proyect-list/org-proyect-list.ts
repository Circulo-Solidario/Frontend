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
import { Tag } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Toasts } from '../../services/toasts';
import { LoginService } from '../../services/login';
import { PermissionsService } from '../../services/permissions';
import { Users } from '../../services/users';
import { Proyects } from '../../services/proyects';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-org-proyect-list',
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    Tag,
    ButtonModule,
    PanelModule,
    SelectModule,
    SliderModule,
    ScrollTopModule,
    ProgressSpinnerModule,
    TextareaModule,
    InputTextModule,
    ConfirmDialogModule
  ],
  providers:[ConfirmationService],
  templateUrl: './org-proyect-list.html',
  styleUrl: './org-proyect-list.css'
})
export class OrgProyectList {
  @ViewChild('dataView') dataView: any;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private router: Router = inject(Router);
  private toasts: Toasts = inject(Toasts);
  private loginService: LoginService = inject(LoginService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private userService: Users = inject(Users);
  private proyectService: Proyects = inject(Proyects);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  logedUser: any;
  collapsed: boolean = true;
  name: any;
  selectedState: any;
  proyects: any;
  filters: any = {};
  organizations: any;
  selectedOrganization: any;
  statesOptions = [
    { name: 'Activos', state: 'ACTIVO' },
    { name: 'Cancelados', state: 'CANCELADO' },
    { name: 'Objetivo logrado', state: 'FINALIZADO_EXITOSO' },
    { name: 'No alcanzó objetivo', state: 'FINALIZADO_NO_EXITOSO' },
  ];

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
    this.getProyects();
  }

  getProyects() {
    this.proyectService.getProyects(this.logedUser?.id, null, null).subscribe({
      next: (response: any) => {
        this.proyects = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al obtener proyectos', detail: 'No pudimos obtener los proyectos publicados, intente nuevamente...'
        })
      }
    })
  }

  getSeverity(proyect: any): 'success' | 'warn' | 'danger' {
    switch (proyect.estado) {
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

  goHome() {
    this.router.navigate(['/principal']);
  }

  editProyect(proyectId: any) {
    this.proyectService.setIdProyect(proyectId);
    this.router.navigate([`/principal/editar-proyecto`]);
  }

  deleteProyect(event: Event, proyectId: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estás seguro de eliminar la publicación?',
      header: 'Eliminiar publicación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
      },
      accept: () => {
        this.proyectService.deleteProyect(proyectId).subscribe({
          next: () => {
            this.toasts.showToast({
              severity: 'success', summary: 'Publicación eliminada', detail: 'Se eliminó correctamente la publicación'
            })
            this.getProyects();
          },
          error: () => {
            this.toasts.showToast({
              severity: 'error', summary: 'Publicación no eliminada', detail: 'Error al eliminar la publicación, intente nuevamente...'
            })
          }
        })
      },
      reject: () => {
      },
    });
  }
}
