import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Toasts } from '../../services/toasts';
import { LoginService } from '../../services/login';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { GoogleAuth } from '../../services/google-auth';
import { Users } from '../../services/users';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Card,
    Message,
    Password,
    Button,
    InputText,
    RouterLink,
    ThemeSwitcher
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private loginService: LoginService = inject(LoginService);
  private userService: Users = inject(Users);
  private router: Router = inject(Router);
  private loginGoogleService: GoogleAuth = inject(GoogleAuth);
  loggedUser: any;
  toastService: Toasts = inject(Toasts);
  loginForm: FormGroup;
  onLogin: boolean = false;

  constructor() {
    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.email]),
      contrasena: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.loggedUser = this.loginService.getLoggedUser();
    if (this.loggedUser != null) {
      this.router.navigate(['/principal']);
    }
  }

  async login() {
    this.onLogin = true;
    try {
      const response = await this.loginService.login(this.loginForm.value);
      this.loginService.setLoggedUser(response.usuario);
      this.router.navigate(['/principal']);
    } catch (error) {
      console.log(error);
      this.toastService.showToast({ severity: 'error', summary: 'Credenciales inválidas', detail: 'Correo y/o contraseña incorrectas' });
    } finally {
      this.onLogin = false;
    }
  }

  async googleLogin() {
    const user = await this.loginGoogleService.loginWithGoogle();
    console.log(user);
    try {
      const loggedUser = await this.userService.getUserInfo(user.email);
      this.loginService.setLoggedUser(loggedUser);
      this.router.navigate(['/principal']);
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(['/crear-perfil'], {
          state: {
            email: user.email,
            name: user.displayName,
            imageUrl: user.photoURL
          }
        });
      }
    }
  }
}
