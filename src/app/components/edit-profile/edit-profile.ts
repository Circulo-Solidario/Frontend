import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectButton } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { Tag } from 'primeng/tag';
import { LoginService } from '../../services/login';
import { PermissionsService } from '../../services/permissions';
import { Router } from '@angular/router';
import { Message } from 'primeng/message';
import { Users } from '../../services/users';
import { ImagePost } from '../../models/images';
import { Images } from '../../services/images';
import { Toasts } from '../../services/toasts';
import { InputMask } from 'primeng/inputmask';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Card,
    DatePicker,
    DatePickerModule,
    InputText,
    Button,
    InputGroupModule,
    InputGroupAddonModule,
    SelectButton,
    Message,
    FileUploadModule,
    Tag,
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  private loginService: LoginService = inject(LoginService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private userService: Users = inject(Users);
  private imageService: Images = inject(Images);
  private router: Router = inject(Router);
  private toastService: Toasts = inject(Toasts);
  today: Date = new Date();
  originalData: any;
  editPassword: boolean = false;
  editUserForm: FormGroup;
  isOrganization: boolean = true;
  userRolesOptions = [
    { label: 'Donante', value: 2 },
    { label: 'Donatario', value: 3 },
    { label: 'Observador', value: 4 },
  ];
  id: number = -1;
  imageUrl: string = '';
  originalUserImage: string = '';
  userImage: string = '';
  changedImage: File | null = null;
  documentoActual: any = null;
  documentoNuevo: File | null = null;
  uploadedPdfFiles: any = [];
  onSaving: boolean = false;

  constructor() {
    this.editUserForm = new FormGroup({
      nombreApellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ]),
      alias: new FormControl('', [Validators.minLength(3), Validators.maxLength(25)]),
      fechaNacimiento: new FormControl(''),
      mercadoPagoAccessToken: new FormControl('', [Validators.minLength(10), Validators.maxLength(255)]),
      // contrasena: new FormControl('', [
      //   Validators.required,
      //   Validators.minLength(8),
      //   Validators.maxLength(25),
      //   this.passwordStrengthValidator(),
      // ])
    });
  }

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user) => {
      this.originalData = user;
      if (!this.originalData) {
        this.router.navigate(['/login']);
        return;
      }
      
      // Validación de permisos para acceder a esta ruta
      if (!this.permissionsService.canAccessRoute(user, this.router.url)) {
        this.router.navigate(['/principal']);
        return;
      }
    });
    this.id = this.originalData.id;
    if (this.originalData.urlImagen) {
      this.originalUserImage = this.originalData.urlImagen;
      this.userImage = this.originalData.urlImagen;
    }
    
    this.editUserForm.setValue({
      nombreApellido: this.originalData.nombreApellido ?? '',
      alias: this.originalData.alias ?? '',
      fechaNacimiento:
        this.originalData.fechaNacimiento?.replaceAll('-', '/') ?? '',
      mercadoPagoAccessToken: this.originalData.mercadoPagoAccessToken ?? ''
    });
    if (this.originalData.tipoUsuario != 'ORGANIZACION') {
      this.isOrganization = false;
      this.editUserForm.addControl(
        'roles',
        new FormControl(
          this.originalData.roles.map((role: any) => {
            return role.id;
          }),
          [Validators.required]
        )
      );
    } else {
      // Cargar documentos de la organización desde el endpoint
      this.userService.getDocumentsFromUser(this.id).subscribe({
        next: (documentos: any[]) => {
          if (documentos && documentos.length > 0) {
            this.documentoActual = documentos[0];
          }
          // Si el array está vacío, documentoActual permanece null y se mostrará solo el upload
        },
        error: (error) => {
          console.error('Error al cargar documentos:', error);
          this.toastService.showToast({
            severity: 'error',
            summary: 'Error al cargar documentos',
            detail: 'No se pudieron cargar los documentos de la organización',
          });
        }
      });
    }
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

  async onSubmit() {
    this.onSaving = true;
    if (this.editUserForm.valid || (this.isOrganization && this.documentoNuevo && !this.editUserForm.valid)) {
      // Caso 1: Solo cambio de documento para organizaciones
      const soloDocumento = this.isOrganization && this.documentoNuevo && this.editUserForm.pristine && !this.changedImage;
      
      if (soloDocumento) {
        // Solo procesar documentos
        try {
          await firstValueFrom(this.userService.postDocumentes(this.id, this.documentoNuevo!));
          
          if (this.documentoActual && this.documentoActual.id) {
            try {
              await firstValueFrom(this.userService.deleteDocument(this.id, this.documentoActual.id));
            } catch (deleteError) {              
              console.error('Error al eliminar documento anterior:', deleteError);
              this.toastService.showToast({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Se subió el nuevo documento pero no se pudo eliminar el anterior',
              });
            }
          }
          
          this.toastService.showToast({
            severity: 'success',
            summary: 'Documento actualizado!',
            detail: 'El documento se actualizó correctamente',
          });
          
          this.uploadedPdfFiles = [];
          this.documentoNuevo = null;
          this.editUserForm.markAsPristine();
          this.loginService.getLoggedUser().subscribe((user) => {
            this.originalData = user;
            if (this.originalData.tipoUsuario == 'ORGANIZACION') {
              this.userService.getDocumentsFromUser(this.id).subscribe({
                next: (documentos: any[]) => {
                  if (documentos && documentos.length > 0) {
                    this.documentoActual = documentos[0];
                  }
                },
                error: (error) => {
                  console.error('Error al cargar documentos:', error);
                }
              });
            }
          });
        } catch (uploadError) {
          console.error('Error al subir documento:', uploadError);
          this.toastService.showToast({
            severity: 'error',
            summary: 'Error al subir documento',
            detail: 'No se pudo subir el nuevo documento',
          });
        }
        this.onSaving = false;
        return;
      }
      
      // Caso 2: Cambios en otros campos (con o sin documento nuevo)
      let editedUser = {
        ...this.editUserForm.value
      };

      if(typeof editedUser.fechaNacimiento == 'string') {
        editedUser.fechaNacimiento = new Date(this.reverseDate(editedUser.fechaNacimiento));        
      }

      let errorSavingImage = false;
      if (this.changedImage) {
        const image: ImagePost = {
          image: this.changedImage,
        };
        try {
          const response = await this.imageService.uploadImage(image);
          this.imageUrl = response.data.url;
        } catch (error) {
          errorSavingImage = true;
        }
      }
      if (this.imageUrl != '') {
        editedUser = {
          ...editedUser,
          urlImagen: this.imageUrl,
        };
      } else {
        editedUser = {
          ...editedUser,
          urlImagen: this.originalData.urlImagen,
        };
      }

      // Manejar documento nuevo para organizaciones no validadas
      if (this.isOrganization && this.documentoNuevo && !this.originalData.validado) {
        try {
          // Primero: subir el nuevo documento
          await firstValueFrom(this.userService.postDocumentes(this.id, this.documentoNuevo!));
          
          // Segundo: si se subió exitosamente, eliminar el documento anterior
          if (this.documentoActual && this.documentoActual.id) {
            try {
              await firstValueFrom(this.userService.deleteDocument(this.id, this.documentoActual.id));
            } catch (deleteError) {
              console.error('Error al eliminar documento anterior:', deleteError);
              this.toastService.showToast({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Se subió el nuevo documento pero no se pudo eliminar el anterior',
              });
            }
          }
          this.toastService.showToast({
            severity: 'success',
            summary: 'Documento subido!',
            detail: 'El nuevo documento se subió correctamente',
          });
        } catch (uploadError) {
          console.error('Error al subir documento:', uploadError);
          this.toastService.showToast({
            severity: 'error',
            summary: 'Error al subir documento',
            detail: 'No se pudo subir el nuevo documento',
          });
          this.onSaving = false;
          return;
        }
      }

      this.userService.editUser(this.id, editedUser).subscribe({
        next: async (data: any) => {
          this.toastService.showToast({
            severity: 'success',
            summary: 'Datos editados!',
            detail: 'Se editaron los datos del usuario correctamente',
          });
          if (errorSavingImage) {
            this.toastService.showToast({
              severity: 'error',
              summary: 'Error al editar imagen',
              detail: 'No se pudo actualizar la imagen, intente nuevamente...',
            });
          }
          this.loginService.setLoggedUser(data);
          this.editUserForm.markAsPristine();
          this.router.navigate(['/principal']);
        },
        error: () => {
          this.toastService.showToast({
            severity: 'error',
            summary: 'Error al editar usuario',
            detail: 'No se pudo actualizar los datos del usuario...',
          });
        },
      });
    }
    this.onSaving = false;
  }

  reverseDate(date: string): string {
    const symbol = date.includes('/');
    const parts = date.split(symbol ? '/' : '-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  cancel() {
    this.editUserForm.get('nombreApellido')?.setValue(this.originalData.nombreApellido ?? '');
    this.editUserForm.get('alias')?.setValue(this.originalData.alias ?? '');
    this.editUserForm.get('mercadoPagoAccessToken')?.setValue(this.originalData.mercadoPagoAccessToken ?? '');
    this.editUserForm
      .get('fechaNacimiento')
      ?.setValue(this.originalData.fechaNacimiento?.replaceAll('-', '/') ?? '');
    // this.editUserForm.get('contrasena')?.setValue(this.originalData.contrasena ?? '');
    if (this.originalData.tipoUsuario != 'ORGANIZACION') {
      this.editUserForm.get('roles')?.setValue(
        this.originalData.roles.map((role: any) => {
          return { id: role.id };
        })
      );
    }
    if (this.originalData.urlImagen) {
      this.originalUserImage = this.originalData.urlImagen;
      this.userImage = this.originalData.urlImagen;
      this.changedImage = null;
    }
    if (this.isOrganization) {
      this.uploadedPdfFiles = [];
      this.documentoNuevo = null;
    }
    this.editUserForm.markAsPristine();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && '|image/jpg|image/jpeg|image/png|'.includes(input.files[0].type)) {
      this.changedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.changedImage);
    } else {
      this.toastService.showToast({
        severity: 'error',
        summary: 'Formato de imagen inválido',
        detail: 'Formatos admitidos: jpg, png o jpeg',
      });
    }
  }

  // Métodos para manejar documentos PDF
  setPdfFile(fileSelected: any) {
    if (this.uploadedPdfFiles.length == 0) {
      this.uploadedPdfFiles.push(fileSelected.files[0]);
    } else {
      this.uploadedPdfFiles[0] = fileSelected.files[0];
    }
    this.documentoNuevo = fileSelected.files[0];
    this.editUserForm.markAsDirty();
  }

  clearPdfFile() {
    if (this.uploadedPdfFiles.length > 0) {
      this.uploadedPdfFiles.pop();
    }
    this.documentoNuevo = null;
  }

  downloadDocument() {
    if (!this.documentoActual) {
      this.toastService.showToast({
        severity: 'warn',
        summary: 'Sin documento',
        detail: 'No hay documento disponible para descargar',
      });
      return;
    }

    this.userService.downloadDocument(this.id, this.documentoActual.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.documentoActual.nombre || 'documento.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar documento:', error);
        this.toastService.showToast({
          severity: 'error',
          summary: 'Error al descargar',
          detail: 'No se pudo descargar el documento',
        });
      }
    });
  }

  viewDocument() {
    if (!this.documentoActual) {
      this.toastService.showToast({
        severity: 'warn',
        summary: 'Sin documento',
        detail: 'No hay documento disponible para visualizar',
      });
      return;
    }

    this.userService.downloadDocument(this.id, this.documentoActual.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      },
      error: (error) => {
        console.error('Error al visualizar documento:', error);
        this.toastService.showToast({
          severity: 'error',
          summary: 'Error al visualizar',
          detail: 'No se pudo visualizar el documento',
        });
      }
    });
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const hasUpperCase = /[A-Z]/.test(control.value);
      const hasLowerCase = /[a-z]/.test(control.value);
      const hasNumber = /\d/.test(control.value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);

      const errors: ValidationErrors = {};

      if (!hasUpperCase) errors['missingUpperCase'] = true;
      if (!hasLowerCase) errors['missingLowerCase'] = true;
      if (!hasNumber) errors['missingNumber'] = true;
      if (!hasSpecialChar) errors['missingSpecialChar'] = true;

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }
}
