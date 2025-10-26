import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Categories } from '../../services/categories';
import { SliderModule } from 'primeng/slider';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Skeleton } from 'primeng/skeleton';
import { LoginService } from '../../services/login';
import { Requests } from '../../services/requests';
import { Notifications, TipoNotificaciones } from '../../services/notifications';
import { ConfirmationService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialog } from 'primeng/confirmdialog';
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
    Skeleton,
    TextareaModule,
    ConfirmDialog
  ],
  providers: [ConfirmationService],
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
  private location: Location = inject(Location);
  private loginService: LoginService = inject(LoginService);
  private requestService: Requests = inject(Requests);
  private notificationService: Notifications = inject(Notifications);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  logedUser: any;
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
  message: string = '';

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.name = params['nombre'];
      params['categoria'] ? this.selectedCategory = Number(params['categoria']) : null;
      params['distancia'] ? this.distance = Number(params['distancia']) : null;
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

  goDetailProducts(idProduct: any) {
    this.router.navigate(['/principal/detalles'], {
      state: { id: idProduct, filters: this.filters }
    });
  }

  searchRequest(item: any): boolean{
    if(item.solicitantes.find((s: any) => s.id == this.logedUser.id)){
      return true;
    }
    return false;
  }

  requestProduct(item: any, message: string): void {    
    this.requestService.requestProduct({
      idSolicitante: this.logedUser.id,
      idProducto: item.id,
      idDondador: item.usuario.id,
      mensaje: message
    }).subscribe({
      next: () => {
        this.toasts.showToast({
          severity: 'success', summary: 'Producto solicitado!', detail: 'Notificamos al donante sobre tu solicitud'
        });
        this.filterData();
        this.notificationService.sendNotification({
            tipoNotificacion: TipoNotificaciones.NUEVA_SOLICITUD,
            deUsuario: this.logedUser.id,
            aUsuario: item.usuario.id,
            mensaje: `Tienes una nueva solicitud del producto ${item.nombre} desde el usuario ${this.logedUser.alias}`
          }).subscribe();
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al solicitar producto', detail: 'No pudimos procesar tu solicitud, intente nuevamente...'
        })
      }
    });
  }

  getProducts() {
    this.filters = {
      nombre: this.name,
      distancia: this.distance,
      page: this.currentPage,
      size: this.pageSize
    }
    const queryParams = { ...this.route.snapshot.queryParams };
    let queryString = new URLSearchParams(queryParams).toString();
    if (!queryString.includes('&distancia=')) {
      queryString += `&distancia=${this.distance}`;
    }
    if (this.selectedCategory) {
      this.filters = {
        ...this.filters,
        categoriaId: this.selectedCategory
      }
      if (!queryString.includes('&categoria=')) {
        queryString += `&categoria=${this.selectedCategory}`;
      }
    }
    this.location.replaceState(`/principal/busqueda?${queryString}`);
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

  getSkeletonItems(cant?: number): number[] {
    return Array.from({ length: cant ?? this.pageSize }, (_, i) => i);
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

  openRquest(item: any, event: MouseEvent) {
    event.stopPropagation();
    this.confirmationService.confirm({
      header: 'Solicitar producto',
      message: 'Envíale un mensaje al donador para solicitar el producto:',
      rejectButtonProps: {
        label: 'Cancelar',
        variant: 'outlined',
        size: 'small',
      },
      acceptButtonProps: {
        label: 'Solicitar',
        size: 'small',
      },
      accept: () => {
        this.requestProduct(item ,this.message);
        this.message = '';
      },
      reject: () => {
        this.message = '';
      },
    });
  }
}
