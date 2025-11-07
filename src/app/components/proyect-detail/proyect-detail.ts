import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Toasts } from '../../services/toasts';
import { LoginService } from '../../services/login';
import { Proyects } from '../../services/proyects';
import { Donation } from '../../services/donation';

@Component({
  selector: 'app-proyect-detail',
  imports: [
    ButtonModule, 
    AvatarModule, 
    BadgeModule, 
    TagModule, 
    CommonModule, 
    FormsModule
  ],
  templateUrl: './proyect-detail.html',
  styleUrl: './proyect-detail.css'
})
export class ProyectDetail implements OnInit{
  private router: Router = inject(Router);
  private toasts: Toasts = inject(Toasts);
  private loginService: LoginService = inject(LoginService);
  private proyectService: Proyects = inject(Proyects);
  private donationService: Donation = inject(Donation);
  id: any;
  filters: any;
  proyectData: any;
  logedUser: any;
  loading = false;


  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
        return;
      }
    });
    const navigation = this.router.currentNavigation();
    const state = navigation?.extras?.state || history.state;
    this.id = state?.['id'];
    this.filters = state?.['filters'];
    this.getProyectData();
    
  }

  async donate(amount: number){
    this.loading = true;
    const preferenceId = await this.donationService.createPreference(this.proyectData?.nombre, amount, this.logedUser.correo);
    await this.donationService.createPayButton(preferenceId);
    this.loading = false;
  }

  getProyectData(){
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
        nombre: this.filters.nombre,
        organizacion: this.filters.organizacion,
        estado: this.filters.estado,
      },
    });
  }
}
