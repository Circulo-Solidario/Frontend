import { Component, inject, OnInit } from '@angular/core';
import { Users } from '../../services/users';
import { Router } from '@angular/router';
import { Toasts } from '../../services/toasts';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { LoginService } from '../../services/login';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
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
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ThemeSwitcher,
    ButtonModule,
    CardModule,
    PasswordModule,
    MessageModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    StepperModule,
    InputMaskModule,
    DividerModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnInit {
  private userService: Users = inject(Users);
  private loginService: LoginService = inject(LoginService);
  private router: Router = inject(Router);
  private toastService: Toasts = inject(Toasts);
  recoveryPasswordForm: FormGroup;
  userId: any;
  loggedUser: any;
  vaildEmail: boolean = true;
  loading: boolean = false;
  invalidCode: boolean = false;
  step: number = 1;

  constructor() {
    this.recoveryPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      codigo: new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
      contrasena: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(25),
        this.passwordStrengthValidator(),
        Validators.required,
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.passWordMatchesValidaor()]),
    });
  }

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.loggedUser = user;
    });
    if (this.loggedUser != null) {
      this.router.navigate(['/principal']);
    }
    this.userId = null;
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  sendRecoveryCode() {
    this.userId = null;
    if (!this.recoveryPasswordForm?.get('email')?.value) {
      this.recoveryPasswordForm?.get('email')?.markAsDirty();
      return;
    }
    this.loading = true;
    this.userService.forgotPassword(this.recoveryPasswordForm?.get('email')?.value).subscribe({
      next: () => {
        this.loading = false;
        this.step = 2;
      },
      error: (error: any) => {
        this.loading = false;
        if (error.status === 400) {
          this.recoveryPasswordForm?.get('email')?.markAsPristine();
          this.vaildEmail = false;
          this.toastService.showToast({
            severity: 'error',
            summary: 'Mail erróneo',
            detail: 'No existe un usuario con el mail ingresado.',
          });
        } else {
          this.toastService.showToast({
            severity: 'error',
            summary: 'Error del servidor',
            detail: 'Ocurrió un error. Intenta más tarde.',
          });
        }
      },
    });
  }

  verifyCode() {
    if (!this.recoveryPasswordForm?.get('codigo')?.value) {
      this.recoveryPasswordForm?.get('codigo')?.markAsDirty();
      return;
    }
    this.loading = true;
    this.userService
      .validateCodeFP(
        this.recoveryPasswordForm?.get('email')?.value,
        this.recoveryPasswordForm?.get('codigo')?.value
      )
      .subscribe({
        next: (response: any) => {
          if (response.usuarioId != null) {
            this.userId = response.usuarioId;
            this.step = 3;
            this.loading = false;
          } else {
            this.recoveryPasswordForm?.get('codigo')?.markAsPristine();
            this.invalidCode = true;
            this.loading = false;
          }
        },
        error: () => {
          this.loading = false;
          this.toastService.showToast({
            severity: 'error',
            summary: 'Error del servidor',
            detail: 'Ocurrió un error. Intenta más tarde.',
          });
        },
      });
  }

  changePassword() {
    if (
      this.recoveryPasswordForm?.get('contrasena')?.invalid ||
      this.recoveryPasswordForm?.get('codigo')?.invalid
    ) {
      return;
    }
    this.loading = true;
    this.userService.changePassword(this.userId, this.recoveryPasswordForm?.get('contrasena')?.value).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.showToast({
          severity: 'success',
          summary: 'Contraseña cambiada',
          detail: 'Tu contraseña ha sido actualizada correctamente.',
        });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
        this.toastService.showToast({
          severity: 'error',
          summary: 'Error del servidor',
          detail: 'Ocurrió un error. Intenta nuevamente.',
        });
      },
    });
  }

  passWordMatchesValidaor(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !this.recoveryPasswordForm?.get('contrasena')?.value) return null;
      const password = this.recoveryPasswordForm?.get('contrasena')?.value;
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
