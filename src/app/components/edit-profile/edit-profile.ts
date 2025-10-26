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
import { LoginService } from '../../services/login';
import { Router } from '@angular/router';
import { Message } from 'primeng/message';
import { Users } from '../../services/users';
import { ImagePost } from '../../models/images';
import { Images } from '../../services/images';
import { Toasts } from '../../services/toasts';
import { InputMask } from 'primeng/inputmask';

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
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  private loginService: LoginService = inject(LoginService);
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

  constructor() {
    this.editUserForm = new FormGroup({
      nombreApellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ]),
      alias: new FormControl('', [Validators.minLength(3), Validators.maxLength(25)]),
      fechaNacimiento: new FormControl(''),
      // contrasena: new FormControl('', [
      //   Validators.required,
      //   Validators.minLength(8),
      //   Validators.maxLength(25),
      //   this.passwordStrengthValidator(),
      // ])
    });
  }

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user) => (this.originalData = user));
    if (!this.originalData) {
      this.router.navigate(['/login']);
    }
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
      // contrasena: this.originalData.contrasena ?? ''
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
    }    
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

  async onSubmit() {
    if (this.editUserForm.valid) {
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
  }

  reverseDate(date: string): string {
    const symbol = date.includes('/');
    const parts = date.split(symbol ? '/' : '-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  cancel() {
    this.editUserForm.get('nombreApellido')?.setValue(this.originalData.nombreApellido ?? '');
    this.editUserForm.get('alias')?.setValue(this.originalData.alias ?? '');
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
