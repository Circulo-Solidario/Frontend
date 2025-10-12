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
  id: any;
  filters: any;
  productData: any;
  donorData: any;

  async ngOnInit(): Promise<void> {
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

  goBack() {
    this.router.navigate(['/principal/busqueda'], {
      queryParams: { nombre: this.filters.nombre, categoria: this.filters.categoriaId, distancia: this.filters.distancia }
    });
  }
}
