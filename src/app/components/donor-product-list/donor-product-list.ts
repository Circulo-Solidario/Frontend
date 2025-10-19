import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Products } from '../../services/products';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';
import { Button, ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { DataView } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { Toasts } from '../../services/toasts';
import { SliderModule } from 'primeng/slider';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoginService } from '../../services/login';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-donor-product-list',
  imports: [
    CommonModule,
    FormsModule,
    DataView,
    SelectButton,
    Tag,
    ButtonModule,
    PanelModule,
    Button,
    SelectModule,
    SliderModule,
    ScrollTopModule,
    ProgressSpinnerModule,
    ConfirmDialogModule
  ],
  providers:[ConfirmationService],
  templateUrl: './donor-product-list.html',
  styleUrl: './donor-product-list.css'
})
export class DonorProductList implements OnInit {
  @ViewChild('dataView') dataView: any;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private router: Router = inject(Router);
  private loginService: LoginService = inject(LoginService);
  private productService: Products = inject(Products);
  private toasts: Toasts = inject(Toasts);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  logedUser: any;
  isLoading: boolean = false;
  products: any;
  layout: 'list' | 'grid' = "grid";
  options = ['list', 'grid'];

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user) => (this.logedUser = user));
    if (!this.logedUser) {
      this.router.navigate(['/login']);
    }
    this.getProducts();
  }

  editProduct(idProduct: any) {
    this.router.navigate(['/principal/editar-publicacion'], {
      state: { id: idProduct }
    });
  }

  deleteProduct(event: Event, idProduct: any) {
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
        this.productService.deleteProduct(idProduct).subscribe({
          next: () => {
            this.toasts.showToast({
              severity: 'success', summary: 'Publicación eliminada', detail: 'Se eliminó correctamente la publicación'
            })
            this.getProducts();
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

  getProducts() {
    this.isLoading = true;
    this.productService.getDonorsProducts(this.logedUser.id).subscribe({
      next: (list: any) => {
        this.products = list;
        this.isLoading = false;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'Error', summary: 'Error al obtener productos', detail: 'Error en el servidor, intente nuevamente'
        })
        this.isLoading = false;
      }
    })
  }

  goHome() {
    this.router.navigate(['/principal']);
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
}
