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
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Divider } from 'primeng/divider';
import { Observable, of } from 'rxjs';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-create-user',
  imports: [
    FormsModule,
    Card,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    CommonModule,
    Divider,
    SelectButtonModule,
    MessageModule
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser implements OnInit {
  userForm: FormGroup;
  userTypeOptions: any[];
  validForm: boolean;

  constructor() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator(),
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.passWordMatchesValidaor()]),
      type: new FormControl(0, [Validators.required]),
    });
    this.userTypeOptions = [
      { label: 'Organización', value: 1 },
      { label: 'Usuario', value: 2 },
    ];
    this.validForm = true;
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.userForm.value);
    console.log(this.userForm.valid);
    this.validForm = this.userForm.valid;
  }

  passWordMatchesValidaor(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !this.userForm?.get('password')?.value) return null;
      const password = this.userForm?.get('password')?.value;
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
}
