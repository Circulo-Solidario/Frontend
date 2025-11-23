import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Proyects } from '../../services/proyects';
import { Toasts } from '../../services/toasts';
import { LoginService } from '../../services/login';
import { PermissionsService } from '../../services/permissions';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ImagePost } from '../../models/images';
import { Images } from '../../services/images';

@Component({
  selector: 'app-create-proyect',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    FileUploadModule,
    ButtonModule,
    TagModule,
    DatePickerModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './create-proyect.html',
  styleUrl: './create-proyect.css'
})
export class CreateProyect implements OnInit {
  @ViewChild(FileUpload) fileUpload!: FileUpload;
  private proyectService: Proyects = inject(Proyects);
  private loginService: LoginService = inject(LoginService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private imageService: Images = inject(Images);
  private toasts: Toasts = inject(Toasts);
  private router: Router = inject(Router);
  today: Date = new Date();
  setUploading: boolean = false;
  proyectForm: FormGroup;
  imagen: File | null = null;
  logedUser: any;
  imagenUrl: string | null = null;

  constructor() {
    this.proyectForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      fechaFin: new FormControl('', [Validators.required]),
      objetivo: new FormControl(undefined, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user) => {
      this.logedUser = user;
      if (!this.logedUser) {
        this.router.navigate(['/login']);
        return;
      }
      
      // Validación de permisos para acceder a esta ruta
      if (!this.permissionsService.canAccessRoute(user, this.router.url)) {
        this.router.navigate(['/principal']);
        return;
      }
    });
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

  goHome() {
    this.router.navigate(['/principal']);
  }

  async onSubmit() {
    this.setUploading = true;
    if (this.proyectForm.invalid) {
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
    let proyect = {
      idOrganizacion: this.logedUser.id,
      imagenes: [this.imagenUrl],
      ...this.proyectForm.value,
    };
    this.proyectService.postProyect(proyect).subscribe({
      next: (response: any) => {
        this.toasts.showToast({
          severity: 'success',
          summary: 'Proyecto publicado!',
          detail: `Proyecto "${response.nombre}" publicado con éxito`,
        });
        this.router.navigate(['/principal']);
        this.setUploading = false;
      },
      error: (error: any) => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Proyecto no publicado',
          detail: 'No pudimos publicar tu proyecto, intente nuevamente',
        });
        this.setUploading = false;
      }
    })
  }

  cancel() {
    this.clearImage();
    this.proyectForm.get('nombre')?.setValue('');
    this.proyectForm.get('descripcion')?.setValue('');
    this.proyectForm.get('fechaFin')?.setValue('');
    this.proyectForm.get('objetivo')?.setValue(undefined);
    this.proyectForm.markAsPristine();
  }
}
