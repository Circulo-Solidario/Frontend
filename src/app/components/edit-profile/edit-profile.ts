import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Password } from 'primeng/password';
import { Divider } from 'primeng/divider';
import { Ripple } from 'primeng/ripple';
import { SelectButton } from 'primeng/selectbutton';
import { LoginService } from '../../services/login';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-edit-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Card,
    DatePicker,
    InputText,
    Button,
    InputGroupModule,
    InputGroupAddonModule,
    Password,
    Divider,
    SelectButton,
    Message
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile {
  private loginService: LoginService = inject(LoginService);
  private router: Router = inject(Router);
  originalData: any;
  editPassword: boolean = false;
  editUserForm: FormGroup;
  isOrganization: boolean = true;
  userRolesOptions = [
    { label: 'Donante', value: { id: 1 } },
    { label: 'Donatario', value: { id: 2 } },
    { label: 'Observador', value: { id: 3 } },
  ];
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
      alias: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(25)
      ]),
      fechaNacimiento: new FormControl(''),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25),
        this.passwordStrengthValidator(),
      ])
    });
  }

  ngOnInit(): void {
    this.originalData = this.loginService.getLoggedUser();
    if (!this.originalData) {
      this.router.navigate(['/login']);
    }
    if (this.originalData.urlImagen) {
      this.originalUserImage = this.originalData.urlImagen;
      this.userImage = this.originalData.urlImagen;
    }
    this.editUserForm.setValue({
      nombreApellido: this.originalData.nombreApellido ?? '',
      alias: this.originalData.alias ?? '',
      fechaNacimiento: this.originalData.fechaNacimiento ? this.reverseDate(this.originalData.fechaNacimiento) : '',
      contrasena: this.originalData.contrasena ?? ''
    });
    if (this.originalData.tipoUsuario != 'ORGANIZACION') {
      this.isOrganization = false;
      this.editUserForm.addControl('roles', new FormControl([], [Validators.required]));
    }
  }

  onSubmit(): void { }

  reverseDate(date: string): string {
    const parts = date.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  cancel() {
    this.editUserForm.setValue({
      nombreApellido: this.originalData.nombreApellido ?? '',
      alias: this.originalData.alias ?? '',
      fechaNacimiento: this.originalData.fechaNacimiento ?? '',
      contrasena: this.originalData.contrasena ?? ''
    });
    if (this.originalData.urlImagen) {
      this.originalUserImage = this.originalData.urlImagen;
      this.userImage = this.originalData.urlImagen;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.changedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = e => {
        this.userImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.changedImage);
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
