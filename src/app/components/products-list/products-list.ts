import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from '../../services/products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { DataView } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, FormsModule, DataView, SelectButton, Tag, ButtonModule, PanelModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: Products = inject(Products);
  products: any;
  filters: any = {};
  layout: 'list' | 'grid' = "grid";
  options = ['list', 'grid'];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filters = params;
      this.productService.getProducts(this.filters).subscribe({
        next: (response: any) => {
          this.products = response;
          console.log(this.products);          
        },
        error: (error) => {},
      });
    });
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
