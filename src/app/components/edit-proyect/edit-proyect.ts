import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Proyects } from '../../services/proyects';
import { Images } from '../../services/images';
import { LoginService } from '../../services/login';
import { PermissionsService } from '../../services/permissions';
import { Toasts } from '../../services/toasts';
import { ImagePost } from '../../models/images';

@Component({
  selector: 'app-edit-proyect',
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
  templateUrl: './edit-proyect.html',
  styleUrl: './edit-proyect.css'
})
export class EditProyect implements OnInit {
  @ViewChild(FileUpload) fileUpload!: FileUpload;
  private router: Router = inject(Router);
  private proyectService: Proyects = inject(Proyects);
  private imageService: Images = inject(Images);
  private loginService: LoginService = inject(LoginService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private toasts: Toasts = inject(Toasts);
  private location: Location = inject(Location);
  
  id: any;
  loggedUser: any;
  originalData: any;
  proyectForm: FormGroup;
  setUploading: boolean = false;
  imagenUrl: string | null = null;
  imagen: File | null = null;
  originalProyectImage: string | null = null;
  changeImage: boolean = false;
  minDate: Date = new Date();

  constructor() {
    this.proyectForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      fechaFin: new FormControl('', [Validators.required]),
      objetivo: new FormControl(undefined, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    
    this.loginService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
      if (!this.loggedUser) {
        this.router.navigate(['/login']);
        return;
      }
      
      // Validación de permisos para acceder a esta ruta
      if (!this.permissionsService.canAccessRoute(user, this.router.url)) {
        this.router.navigate(['/principal']);
        return;
      }
    });

    this.id = this.proyectService.getIdProyect();
    if (!this.id) {
      this.router.navigate(['/principal']);
      return;
    }

    this.loadProyectData();
  }

  reverseDate(date: string): string {
    const symbol = date.includes('/');
    const parts = date.split(symbol ? '/' : '-');
    return `${parts[2]}-${parts[1]}-${(Number(parts[0])+1)}`;
  }

  private loadProyectData(): void {
    this.proyectService.getProyect(this.id).subscribe({
      next: (response: any) => {
        this.originalData = response;

        const fechaFin = new Date(this.reverseDate(this.originalData.fechaFin));

        this.proyectForm.setValue({
          nombre: this.originalData.nombre,
          descripcion: this.originalData.descripcion,
          fechaFin: fechaFin,
          objetivo: this.originalData.objetivo
        });
        
        if (this.originalData.imagenes && this.originalData.imagenes.length > 0) {
          const primeraImagen = this.originalData.imagenes[0];
          
          if (typeof primeraImagen === 'string') {
            this.imagenUrl = primeraImagen;
          } else if (primeraImagen && primeraImagen.url) {
            this.imagenUrl = primeraImagen.url;
          } else if (primeraImagen && primeraImagen.urlImagen) {
            this.imagenUrl = primeraImagen.urlImagen;
          } else {
            this.imagenUrl = null;
          }
          
          this.originalProyectImage = this.imagenUrl;
          this.changeImage = false;
          
        } else {
        }
      },
      error: (err) => {
        console.error('Error obteniendo proyecto:', err);
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al obtener proyecto',
          detail: 'No pudimos obtener el proyecto, intente nuevamente...'
        });
        this.goBack();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  choose(): void {
    this.fileUpload.choose();
  }

  setImage(fileSelected: FileSelectEvent): void {
    if (!'|image/jpg|image/jpeg|image/png|'.includes(fileSelected.files[0].type)) {
      this.showImageError();
      return;
    }
    this.imagen = fileSelected.files[0];
    this.changeImage = true;
  }

  showImageError(): void {
    this.toasts.showToast({
      severity: 'error',
      summary: 'Formato de imagen inválido',
      detail: 'Formatos admitidos: jpg, png o jpeg',
    });
  }

  clearImage(): void {
    this.fileUpload.clear();
    this.imagen = null;
    this.imagenUrl = null;
    this.changeImage = true;
  }

  async onSubmit(): Promise<void> {
    this.setUploading = true;
    
    if (this.proyectForm.invalid) {
      this.setUploading = false;
      return;
    }

    if (this.changeImage && this.imagen) {
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
    } else if (!this.changeImage) {
      this.imagenUrl = this.originalProyectImage;
    }

    let proyect = {
      idOrganizacion: this.loggedUser.id,
      imagenes: this.imagenUrl ? [this.imagenUrl] : [],
      ...this.proyectForm.value,
    };

    this.proyectService.editProyect(this.id, proyect).subscribe({
      next: () => {
        this.toasts.showToast({
          severity: 'success',
          summary: 'Proyecto editado!',
          detail: `Se editó el proyecto con éxito`,
        });
        this.goBack();
        this.setUploading = false;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al editar proyecto',
          detail: 'No pudimos editar tu proyecto, intente nuevamente...',
        });
        this.setUploading = false;
      },
    });
  }

  cancel(): void {
    if (this.originalData) {
      this.proyectForm.setValue({
        nombre: this.originalData.nombre,
        descripcion: this.originalData.descripcion,
        fechaFin: new Date(this.reverseDate(this.originalData.fechaFin)),
        objetivo: this.originalData.objetivo
      });
      
      this.changeImage = false;
      this.imagenUrl = this.originalProyectImage;
      this.imagen = null;
      if (this.fileUpload) {
        this.fileUpload.clear();
      }
      this.proyectForm.markAsPristine();
    }
  }
}
