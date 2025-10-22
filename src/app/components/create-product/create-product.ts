import { CommonModule } from '@angular/common';
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
  selector: 'app-create-product',
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
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProduct implements OnInit {
  @ViewChild(FileUpload) fileUpload!: FileUpload;
  private router: Router = inject(Router);
  private categoriesService: Categories = inject(Categories);
  private loginService: LoginService = inject(LoginService);
  private productService: Products = inject(Products);
  private imageService: Images = inject(Images);
  private toasts: Toasts = inject(Toasts);
  private geolocationService: Geolocation = inject(Geolocation);
  loggedUser: any;
  productForm: FormGroup;
  imagen: File | null = null;
  setUploading: boolean = false;
  imagenUrl: string | null = null;
  categories: any;
  coords: GeolocationCoordinates | null = null;

  constructor() {
    this.productForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
      categoria: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.loginService.getLoggedUser().subscribe((user) => (this.loggedUser = user));
    if (!this.loggedUser) {
      this.router.navigate(['/login']);
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
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

  setImage(fileSelected: FileSelectEvent) {
    if (!'|image/jpg|image/jpeg|image/png|'.includes(fileSelected.files[0].type)) {
      this.showImageError();
      return;
    }
    this.imagen = fileSelected.files[0];
  }

  choose() {
    this.fileUpload.choose();
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
    if (this.imagen) {
      const image: ImagePost = {
        image: this.imagen,
      };
      try {
        const response = await this.imageService.uploadImage(image);
        this.imagenUrl = response.data.url;
      } catch (error) {
        errorSavingImage = true;
      }
    } else {
      this.toasts.showToast({
        severity: 'error',
        summary: 'Error al registrar producto',
        detail: 'Ingrese correctamente los campos obligatorios',
      });
      this.setUploading = false;
      return;
    }
    if (errorSavingImage || !this.imagenUrl) {
      this.toasts.showToast({
        severity: 'error',
        summary: 'Error al guardar imagen',
        detail: 'No se pudo guardar la imagen correctamente, intente más tarde...',
      });
      this.setUploading = false;
      return;
    }    
    let product = {
      estado: 'DISPONIBLE',
      idUsuario: this.loggedUser.id,
      urlImagen: this.imagenUrl,
      ...this.productForm.value,
    };
    this.productService.publishProduct(product).subscribe({
      next: (response: any) => {
        this.toasts.showToast({
          severity: 'success',
          summary: 'Producto publicado!',
          detail: `Producto "${response.nombre}" publicado con éxito`,
        });
        this.router.navigate(['/principal']);
        this.setUploading = false;
      },
      error: (error: any) => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Producto no publicado',
          detail: 'No pudimos publicar tu producto, intente nuevamente',
        });
        this.setUploading = false;
      },
    });
  }

  cancel() {
    this.clearImage();
    this.productForm.get('nombre')?.setValue('');
    this.productForm.get('categoria')?.setValue(null);
    this.productForm.get('descripcion')?.setValue('');
    this.productForm.markAsPristine();
  }
}
