import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
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
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-proyects-list',
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
    InputTextModule
  ],
  templateUrl: './proyects-list.html',
  styleUrl: './proyects-list.css'
})
export class ProyectsList implements OnInit {
  @ViewChild('dataView') dataView: any;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toasts: Toasts = inject(Toasts);
  private loginService: LoginService = inject(LoginService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private userService: Users = inject(Users);
  private proyectService: Proyects = inject(Proyects);
  private location: Location = inject(Location);
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
  ]

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
    this.route.queryParams.subscribe((params) => {
      this.name = params['nombre'] ?? null;
      params['organizacion'] ? this.selectedOrganization = params['organizacion'] : null;
      params['estado'] ? this.selectedState = params['estado'] : null;
      this.filterData();
    });
    this.getOrganizations();
    this.getProyects();
  }

  getProyects() {
    let queryString = '';
    this.filters = {}
    if (this.name) {
      queryString += `&nombre=${this.name}`;
      this.filters = {
        nombre: this.name
      }
    }
    if (this.selectedOrganization) {
      this.filters = {
        ...this.filters,
        organizacion: this.selectedOrganization
      }
      queryString += `&organizacion=${this.selectedOrganization}`;
    }
    if (this.selectedState) {
      this.filters = {
        ...this.filters,
        estado: this.selectedState
      }
      queryString += `&estado=${this.selectedState}`;
    }
    if (queryString) {
      this.location.replaceState(`/principal/proyectos?${queryString.replace('&', '')}`);
    } else{
      this.location.replaceState(`/principal/proyectos`);
    }
    this.proyectService.getProyects(this.selectedOrganization, this.selectedState, this.name).subscribe({
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

  getOrganizations() {
    this.userService.getFilteredUsers(true, 'ORGANIZACION').subscribe({
      next: (response: any) => {
        this.organizations = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al obtener organizaciones', detail: 'No pudimos listar las organizaciones, intente nuevamente...'
        })
      }
    })
  }

  goProyectDetail(proyect: any) {
    this.router.navigate(['/principal/detalles-proyecto'], {
      state: { id: proyect.id, filters: this.filters }
    });
  }

  filterData() {
    this.proyects = [];
    (document.activeElement as HTMLElement)?.blur();
    this.collapsed = true;
    this.getProyects();
  }

  clearFilters() {
    this.name = null;
    this.selectedOrganization = null;
    this.selectedState = null;
    this.filterData();
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
}
