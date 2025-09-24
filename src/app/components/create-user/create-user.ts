import 'primeicons/primeicons.css';
import { Component, OnInit } from '@angular/core';
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
import { Toast, ToastModule } from 'primeng/toast';
import { ScrollerModule } from 'primeng/scroller';
import { Images } from '../../services/images';
import { ImagePost } from '../../models/images';
import { Users } from '../../services/users';
import { MessageService } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

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
    ToastModule,
    ScrollerModule,
    Ripple
  ],
  providers: [MessageService],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser implements OnInit {
  private imageService: Images;
  private userService: Users;
  private messageService: MessageService;
  accountForm: FormGroup;
  userForm: FormGroup;
  charityForm: FormGroup;
  userRolesOptions = [
    { label: 'Donante', value: 1 },
    { label: 'Donatario', value: 2 },
    { label: 'Observador', value: 3 },
  ];
  activeStep: number = 1;
  typeSelected: number = 1;
  uploadedFiles: any = [];
  postUser: boolean = false;
  image: any;
  imageUrl: string = '';


  constructor(imageService: Images, userService: Users, messageService: MessageService) {
    this.imageService = imageService;
    this.userService = userService;
    this.messageService = messageService;

    this.accountForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email], [this.emailValidator()]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25),
        this.passwordStrengthValidator(),
      ]
    ),
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

  changeType(type: number) {
    switch (type) {
      case 0: {
        this.charityForm.reset();
        this.clearImage();
        this.typeSelected = 1;
        break;
      }
      case 1: {
        this.userForm.reset();
        this.clearImage();
        this.typeSelected = 2;
        break;
      }
    }
  }

  async onSubmit() {
    let account = this.accountForm.value;
    account = {
      ...account,
      activo: true
    }
    let errorSavingImage = false;
    delete account.confirmPassword;
    this.postUser = true;

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

    if (this.userForm.valid) {
      account = {
        ...account,
        ...this.userForm.value
      }
    }
    if (this.charityForm.valid) {
      account = {
        ...account,
        ...this.charityForm.value
      }
    }
    if (this.imageUrl != '') {
      account = {
        ...account,
        urlImagen: this.imageUrl
      }
    }

    if (account.fechaNacimiento == '') {
      delete account.fechaNacimiento;
    }
    if (account.roles) {
      delete account.roles;
    }
    try {
      const response = await this.userService.registerUser(account);
      this.messageService.add({ severity: 'success', summary: 'Usuario creado!', detail: 'Usuario creado correctamente' });
      if (errorSavingImage) {
        this.messageService.add({ severity: 'warn', summary: 'Error al guardar imagen', detail: 'Puedes cargar nuevamente la imagen desde la edición del perfil' });
      }
      this.postUser = false;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error al crear usuario', detail: 'Por favor intente nuevamente...' });
      this.postUser = false;
    }
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
      if (!control.parent) {
        return of(null);
      }
      return timer(1000).pipe(
        switchMap(() =>
          this.userService.validateEmail(control.value).pipe(
            map((exist: boolean) => {
              return exist ? { emailExists: true } : null;
            }),
            catchError(() => {
              return of({ serverError: false });
            })
          )
        )
      );
    };
  }
}
