import 'primeicons/primeicons.css';
import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Divider } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { StepperModule } from 'primeng/stepper';
import { TabsModule } from 'primeng/tabs';
import { DatePickerModule } from 'primeng/datepicker';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ScrollerModule } from 'primeng/scroller';
import { Images } from '../../services/images';
import { ImagePost } from '../../models/images';
import { Users } from '../../services/users';
import { Ripple } from 'primeng/ripple';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { Router } from '@angular/router';
import { Toasts } from '../../services/toasts';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { LoginService } from '../../services/login';

@Component({
  selector: 'app-create-user',
  imports: [
    FormsModule,
    Card,
    Password,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    Divider,
    SelectButtonModule,
    MessageModule,
    StepperModule,
    TabsModule,
    DatePickerModule,
    FileUploadModule,
    ScrollerModule,
    Ripple,
    ThemeSwitcher
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser implements OnInit {
  private logginService: LoginService = inject(LoginService);
  private imageService: Images = inject(Images);
  private userService: Users = inject(Users);
  private router: Router = inject(Router);
  private location = inject(Location)
  toastService: Toasts = inject(Toasts);
  accountForm: FormGroup;
  userForm: FormGroup;
  charityForm: FormGroup;
  userRolesOptions = [
    { label: 'Donante', value: 2 },
    { label: 'Donatario', value: 3 },
    { label: 'Observador', value: 4 },
  ];
  today: Date = new Date();
  activeStep: number = 1;
  typeSelected: number = 1;
  uploadedFiles: any = [];
  uploadedPdfFiles: any = [];  // Para archivos PDF de organizaciones
  postUser: boolean = false;
  image: any;
  imageUrl: string = '';


  constructor() {
    this.accountForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email], [this.emailValidator()]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25),
        this.passwordStrengthValidator(),
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.passWordMatchesValidaor()])
    });

    this.userForm = new FormGroup({
      nombreApellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ]),
      alias: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(25),
        Validators.required
      ]),
      fechaNacimiento: new FormControl(''),
      roles: new FormControl([], [Validators.required]),
    });

    this.charityForm = new FormGroup({
      nombreApellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ]),
      alias: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(25),
        Validators.required
      ]),
      fechaNacimiento: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.logginService.getLoggedUser().subscribe(
      (user: any) => {
        if (user != null) {
          this.router.navigate(['/principal']);
        }
      }
    );
  }

  setImage(fileSelected: FileSelectEvent) {
    if (this.uploadedFiles.length == 0) {
      this.uploadedFiles.push(fileSelected.files[0]);
    } else {
      this.uploadedFiles[0] = fileSelected.files[0];
    }
  }

  clearImage() {
    if (this.uploadedFiles.length > 0) {
      this.uploadedFiles.pop();
    }
  }

  setPdfFile(fileSelected: FileSelectEvent) {
    if (this.uploadedPdfFiles.length == 0) {
      this.uploadedPdfFiles.push(fileSelected.files[0]);
    } else {
      this.uploadedPdfFiles[0] = fileSelected.files[0];
    }
  }

  clearPdfFile() {
    if (this.uploadedPdfFiles.length > 0) {
      this.uploadedPdfFiles.pop();
    }
  }

  changeType(type: number) {
    switch (type) {
      case 0: {
        this.typeSelected = 1;
        break;
      }
      case 1: {
        this.typeSelected = 2;
        break;
      }
    }
  }

  async onSubmit() {
    this.postUser = true;
    let account = this.accountForm.value;

    account = {
      ...account
    }

    switch (this.typeSelected) {
      case 1: {
        account = {
          ...account,
          tipoUsuario: 'USUARIO'
        };
        if (this.userForm.valid) {
          account = {
            ...account,
            ...this.userForm.value
          }
        }
        break;
      }
      case 2: {
        account = {
          ...account,
          tipoUsuario: 'ORGANIZACION'
        };
        if (this.charityForm.valid) {
          account = {
            ...account,
            ...this.charityForm.value
          }
        }
        break;
      }
    }

    let errorSavingImage = false;
    delete account.confirmPassword;

    if (this.uploadedFiles[0] != this.image) {
      const image: ImagePost = {
        image: this.uploadedFiles[0]
      }
      try {
        const response = await this.imageService.uploadImage(image);
        this.imageUrl = response.data.url;
        this.image = this.uploadedFiles[0];
      } catch (error) {
        errorSavingImage = true;
      }
    };

    if (this.imageUrl != '') {
      account = {
        ...account,
        urlImagen: this.imageUrl
      }
    }

    if (account.fechaNacimiento == '') {
      delete account.fechaNacimiento;
    }

    try {
      const response = await this.userService.registerUser(account);
      this.toastService.showToast({ severity: 'success', summary: 'Usuario creado!', detail: 'Usuario creado correctamente' });
      if (errorSavingImage) {
        this.toastService.showToast({ severity: 'warn', summary: 'Error al guardar imagen', detail: 'Puedes cargar nuevamente la imagen desde la edición del perfil' });
      }
      this.postUser = false;
      if (this.typeSelected == 2 && this.uploadedPdfFiles.length > 0) {
        this.userService.postDocumentes(response.id, this.uploadedPdfFiles[0]).subscribe({
          next: () => {
            this.toastService.showToast({ severity: 'success', summary: 'Documentos subidos!', detail: 'Documentos subidos correctamente' });
          },
          error: () => {
            this.toastService.showToast({ severity: 'warn', summary: 'Error al subir documentos', detail: 'No pudimos subir los documentos, puedes intentar nuevamente desde la edición del perfil' });
          }
        });
      }
      timer(500).subscribe(
        () => {
          this.router.navigateByUrl("/login");
        }
      );
    } catch (error) {
      this.toastService.showToast({ severity: 'error', summary: 'Error al crear usuario', detail: 'Por favor intente nuevamente...' });
      this.postUser = false;
    }
  }

  goBack() {
    this.location.back();
  }

  passWordMatchesValidaor(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !this.accountForm?.get('contrasena')?.value) return null;
      const password = this.accountForm?.get('contrasena')?.value;
      const confirmPassword = control.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
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

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.parent || control.parent.getError('email')) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() =>
          this.userService.validateEmail(control.value).pipe(
            map((exist: boolean) => {
              return exist ? { emailExists: true } : null;
            }),
            catchError(() => {
              this.toastService.showToast({ severity: 'warn', summary: 'Error al validar mail', detail: 'No pudimos validar disponibilad de tu email.' });
              return of(null);
            })
          )
        )
      );
    };
  }
}
