import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from '../../services/products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';
import { Button, ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { DataView } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { Toasts } from '../../services/toasts';
import { Categories } from '../../services/categories';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-products-list',
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
    SliderModule
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: Products = inject(Products);
  private toasts: Toasts = inject(Toasts);
  private categoriesService: Categories = inject(Categories);
  collapsed: boolean = true;
  name: any;
  distance: any = 15;
  products: any;
  filters: any = {};
  categories: any;
  selectedCategory: any;
  layout: 'list' | 'grid' = "grid";
  options = ['list', 'grid'];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filters = params;
      this.name = params['nombre']
    });
    this.filters = {
      ...this.filters,
      distancia: this.distance
    }
    this.getProducts();
    this.categoriesService.getCategories().subscribe({
      next: (categoriesList: any) => {
        this.categories = categoriesList;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al cargar categorías',
          text: 'No se pudieron cargar las categorías, intente mas tarde...',
        });
      },
    });
  }

  getProducts() {
    this.productService.getProducts(this.filters).subscribe({
      next: (response: any) => {
        this.products = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'Error', summary: 'Error al obtener productos', detail: 'Error en el servidor, intente nuevamente'
        })
      },
    });
  }

  clearFilters() {
    this.distance = 15;
    this.selectedCategory = null;
    this.filterData();
  }

  filterData() {
    this.filters = {
      nombre: this.name,
      distancia: this.distance,
    }
    if (this.selectedCategory) {
      this.filters = {
        ...this.filters,
        categoria: this.selectedCategory
      }
    }
    (document.activeElement as HTMLElement)?.blur();
    this.collapsed = true;
    this.getProducts();
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

  getSeverity(product: any) {
    switch (product.estado) {
      case 'EN_STOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return 'success';
    }
  }
}
