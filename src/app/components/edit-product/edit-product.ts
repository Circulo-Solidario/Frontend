import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { Categories } from '../../services/categories';
import { Toasts } from '../../services/toasts';
import { TagModule } from 'primeng/tag';
import { Products } from '../../services/products';
import { Images } from '../../services/images';
import { ImagePost } from '../../models/images';
import { LoginService } from '../../services/login';
import { Geolocation } from '../../services/geolocation';

@Component({
  selector: 'app-edit-product',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Card,
    Button,
    FileUpload,
    TextareaModule,
    InputText,
    SelectModule,
    TagModule
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {
  @ViewChild(FileUpload) fileUpload!: FileUpload;
  private router: Router = inject(Router);
  private categoriesService: Categories = inject(Categories);
  private loginService: LoginService = inject(LoginService);
  private productService: Products = inject(Products);
  private imageService: Images = inject(Images);
  private toasts: Toasts = inject(Toasts);
  private geolocationService: Geolocation = inject(Geolocation);
  private location: Location = inject(Location);
  id: any;
  loggedUser: any;
  originalData: any;
  productForm: FormGroup;
  setUploading: boolean = false;
  categories: any;
  coords: GeolocationCoordinates | null = null;
  imagenUrl: string | null = null;
  imagen: File | null = null;
  originalProductImage: File | null = null;
  changeImage: boolean = false;

  constructor() {
    this.productForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
      categoriaId: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.loginService.getLoggedUser().subscribe((user) => (this.loggedUser = user));
    if (!this.loggedUser) {
      this.router.navigate(['/login']);
    }
    const navigation = this.router.currentNavigation();
    const state = navigation?.extras?.state || history.state;
    this.id = state?.['id'];
    if (!this.id) {
      this.router.navigate(['/principal/mis-publicaciones']);
    }
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
    this.productService.getProductDetail(this.id).subscribe({
      next: (response: any) => {
        this.originalData = response;
        this.productForm.setValue({
          nombre: this.originalData.nombre,
          descripcion: this.originalData.descripcion,
          categoriaId: this.originalData.categoria.id
        });
        this.imagen = this.originalData.urlImagen;
        this.imagenUrl = this.originalData.urlImagen;
        this.originalProductImage = this.originalData.urlImagen;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al obtener producto', detail: 'No pudimos obtener el producto, intente nuevamente...'
        })
        this.location.back();
      }
    })
  }

  goBack() {
    this.location.back();
  }

  choose() {
    this.fileUpload.choose();
  }

  setImage(fileSelected: FileSelectEvent) {
    if (!'|image/jpg|image/jpeg|image/png|'.includes(fileSelected.files[0].type)) {
      this.showImageError();
      return;
    }
    this.imagen = fileSelected.files[0];

  }

  showImageError() {
    this.toasts.showToast({
      severity: 'error',
      summary: 'Formato de imagen inválido',
      detail: 'Formatos admitidos: jpg, png o jpeg',
    });
  }

  clearImage() {
    this.fileUpload.clear();
    this.imagen = null;
    this.changeImage = true;
  }

  async onSubmit() {
    this.setUploading = true;
    if (this.productForm.invalid) {
      this.setUploading = false;
      return;
    }
    try {
      const pos = await this.geolocationService.getCurrentPosition();
      this.coords = pos.coords;
    } catch (err) {
      this.toasts.showToast({
        severity: 'error', summary: 'Error de ubicación', detail: `${(err as Error).message}`
      });
      this.setUploading = false;
      return;
    }
    let errorSavingImage = false;
    if (this.imagen != this.originalProductImage && this.imagen) {
      const image: ImagePost = {
        image: this.imagen,
      };
      try {
        const response = await this.imageService.uploadImage(image);
        this.imagenUrl = response.data.url;
      } catch (error) {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al guardar imagen',
          detail: 'No se pudo guardar la imagen correctamente, intente más tarde...',
        });
        this.setUploading = false;
        return;
      }
    }
    if (this.imagen == this.originalProductImage) {
      this.imagenUrl = this.originalData.urlImagen;
    }
    if (this.imagenUrl == null) {
      this.toasts.showToast({
        severity: 'error',
        summary: 'Error al registrar producto',
        detail: 'Ingrese correctamente los campos obligatorios',
      });
      this.setUploading = false;
      return;
    }
    if (errorSavingImage) {

    }
    let product = {
      idUsuario: this.loggedUser.id,
      urlImagen: this.imagenUrl,
      ...this.productForm.value,
    };
    this.productService.editProduct(this.id, product).subscribe({
      next: (response: any) => {
        this.toasts.showToast({
          severity: 'success',
          summary: 'Publicación editada!',
          detail: `Se editó la publicación con éxito`,
        });
        this.location.back();
        this.setUploading = false;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al editar publicación',
          detail: 'No pudimos editar tu publicación, intente nuevamente...',
        });
        this.setUploading = false;
      },
    });
  }

  cancel() {
    this.productForm.setValue({
      nombre: this.originalData.nombre,
      descripcion: this.originalData.descripcion,
      categoriaId: this.originalData.categoria.id
    });
    this.changeImage = false;
    this.imagen = this.originalData.urlImagen;
    this.productForm.markAsPristine();
  }
}
