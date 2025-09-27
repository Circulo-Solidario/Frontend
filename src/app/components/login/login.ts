import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Toasts } from '../../services/toasts';
import { LoginService } from '../../services/login';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";

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
export class Login {
  private loginService: LoginService = inject(LoginService)
  toastService: Toasts = inject(Toasts);
  loginForm: FormGroup;
  onLogin: boolean = false;

  constructor(){
    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.email]),
      contrasena: new FormControl('')
    })
  }

  async login(){
    this.onLogin = true;
    try{
      const response = await this.loginService.login(this.loginForm);
      
    }catch(error){
      this.toastService.showToast({ severity: 'error', summary: 'Credenciales inválidas', detail: 'Correo y/o contraseña incorrectas' });
    }
  }
}
