import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/login';
import { Router } from '@angular/router';
import { Messages } from '../../services/messages';
import { Toasts } from '../../services/toasts';
import { CommonModule, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Rooms } from '../../services/rooms';
import { AvatarModule } from 'primeng/avatar';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    TextareaModule,
    ButtonModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {
  private loginService: LoginService = inject(LoginService);
  private messagesService: Messages = inject(Messages);
  private roomService: Rooms = inject(Rooms);
  private toasts: Toasts = inject(Toasts);
  private router: Router = inject(Router);
  private location: Location = inject(Location)
  private messageSubscription?: Subscription;
  logedUser: any;
  chat: any;
  userChat: any;
  message: string = '';
  messages: any[] = [];

  private subscribeToMessages(): void {
    this.messageSubscription = this.messagesService.messages$.subscribe({
      next: (message: any) => {
        if (message && message.mensaje) {
          this.messages.push(message);
        }
        console.log(this.messages);
        
      }
    });
  }

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
        return;
      }
    });
    this.roomService.chat$.subscribe(chat => {
      if (!chat) {
        this.router.navigate(['principal/chats']);
        return;
      }
      this.chat = chat;
      if (chat.solicitud.donador.id == this.logedUser.id) {
        this.userChat = chat.solicitud.solicitante;
      } else {
        this.userChat = chat.solicitud.donador;
      }
      this.messagesService.joinRoom(this.chat.nombreSala);
      this.loadChatMessages();
      this.subscribeToMessages();
    });

  }

  goBack(){
    this.location.back();
  }

  loadChatMessages() {
    this.messagesService.getRoomMessages(this.chat.id).subscribe({
      next: (response: any) => {
        this.messages = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al obtener mensajes', detail: 'No pudimos obtener el historial del chat, intente nuevamente...'
        })
      }
    })
  }

  sendMessage() {
    if (!this.message.trim()) {
      return;
    }

    const messageRequest = {
      mensaje: this.message,
      idUsuario: this.logedUser.id,
      idSala: this.chat.id
    }

    this.messagesService.sendMessage(messageRequest).subscribe({
      next: (response: any) => {
        this.message = '';
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al enviar mensaje', detail: 'No pudimos enviar tu mensaje, intente nuevamente...'
        })
      }
    })
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.messagesService.disconnect();
  }
}
