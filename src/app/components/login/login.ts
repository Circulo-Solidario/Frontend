import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Toast } from 'primeng/toast';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Card,
    Toast,
    Message,
    Password,
    Button,
    InputText,
    RouterLink
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  onLogin: boolean = false;

  constructor(messageService: MessageService){
    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.email]),
      contrasena: new FormControl('')
    })
  }

  login(){
    this.onLogin = true;
    timer(1000).subscribe(
      () => {
        this.onLogin = false;
      }
    )
  }
}
