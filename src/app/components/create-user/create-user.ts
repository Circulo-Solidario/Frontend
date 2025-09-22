import 'primeicons/primeicons.css';
import { Component, OnInit } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { ScrollerModule } from 'primeng/scroller';

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
    HttpClientModule
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser implements OnInit {
  accountForm: FormGroup;
  userForm: FormGroup;
  charityForm: FormGroup;
  userRolesOptions: any[];
  uploadedFiles: any[];
  activeStep: number;
  typeSelected: number;

  constructor() {
    this.accountForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25),
        this.passwordStrengthValidator(),
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.passWordMatchesValidaor()])
    });

    this.userForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ]),
      birthDate: new FormControl(''),
      roles: new FormControl([], [Validators.required]),
    });

    this.charityForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ]),
      fundationDate: new FormControl('')
    });

    this.userRolesOptions = [
      { label: 'Donante', value: 1 },
      { label: 'Donatario', value: 2 },
      { label: 'Observador', value: 3 },
    ];

    this.activeStep = 1;

    this.typeSelected = 1;

    this.uploadedFiles = [];
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

  onSubmit() {
    let account = this.accountForm.value;
    delete account.confirmPassword;

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

    console.log('accountForm:', this.accountForm.value);
    console.log('userFormValid:', this.userForm.valid);
    console.log('userForm:', this.userForm.value);
    console.log('charityFormValid:', this.charityForm.valid);
    console.log('charityForm:', this.charityForm.value);
    console.log('account', account);
  }

  passWordMatchesValidaor(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !this.accountForm?.get('password')?.value) return null;
      const password = this.accountForm?.get('password')?.value;
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
