import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import { ScrollTopModule } from 'primeng/scrolltop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Skeleton } from 'primeng/skeleton';
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
    SliderModule,
    ScrollTopModule,
    ProgressSpinnerModule,
    Skeleton
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  @ViewChild('dataView') dataView: any;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: Products = inject(Products);
  private toasts: Toasts = inject(Toasts);
  private categoriesService: Categories = inject(Categories);
  currentPage: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  hasMoreData: boolean = true;
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
      this.name = params['nombre']
      this.filterData();
    });
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
    this.filters = {
      nombre: this.name,
      distancia: this.distance,
      page: this.currentPage,
      size: this.pageSize
    }
    if (this.selectedCategory) {
      this.filters = {
        ...this.filters,
        categoriaId: this.selectedCategory
      }
    }
    this.productService.getProducts(this.filters).subscribe({
      next: (newProducts: any) => {
        if (newProducts.content.length < this.pageSize) {
          this.hasMoreData = false;
        }
        if (!this.products) {
          this.products = newProducts.content;
        } else {
          this.products = [...this.products, ...newProducts.content];
        }
        this.isLoading = false;
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
    this.isLoading = true;
    this.products = [];
    this.currentPage = 0;
    this.hasMoreData = true;
    (document.activeElement as HTMLElement)?.blur();
    this.collapsed = true;
    this.getProducts();
  }

  loadMoreData() {
    if (this.isLoading || !this.hasMoreData) return;
    this.isLoading = true;
    this.currentPage++;
    this.getProducts();
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

  onScroll(event: any) {
    if (this.shouldLoadMore()) {
      this.loadMoreData();
    }
  }

  getSeverity(product: any): string {
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

  getSkeletonItems(cant?: number): number[]{
     return Array.from({length: cant ?? this.pageSize}, (_, i) => i);
  }

  private shouldLoadMore(): boolean {
    if (this.isLoading || !this.hasMoreData) return false;

    const element = this.scrollContainer.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const threshold = 50;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    return isNearBottom;
  }
}
