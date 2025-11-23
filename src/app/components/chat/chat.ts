import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoginService } from '../../services/login';
import { PermissionsService } from '../../services/permissions';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    TextareaModule,
    ButtonModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private loginService: LoginService = inject(LoginService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private messagesService: Messages = inject(Messages);
  private roomService: Rooms = inject(Rooms);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private toasts: Toasts = inject(Toasts);
  private router: Router = inject(Router);
  private location: Location = inject(Location);
  private messageSubscription?: Subscription;
  logedUser: any;
  chat: any;
  userChat: any;
  message: string = '';
  messages: any[] = [];
  delivered: boolean = false;

  private subscribeToMessages(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.messageSubscription = this.messagesService.messages$.subscribe({
      next: (message: any) => {
        if (message && message.mensaje) {
          this.messages.push(message);
        }
      },
    });
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {}
  }

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
        return;
      }
      
      // Validación de permisos para acceder a esta ruta
      if (!this.permissionsService.canAccessRoute(user, this.router.url)) {
        this.router.navigate(['/principal']);
        return;
      }
    });
    this.roomService.chat$.subscribe((chat) => {
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

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    //this.messagesService.disconnect();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  goBack() {
    this.location.back();
  }

  loadChatMessages() {
    this.messagesService.getRoomMessages(this.chat.id).subscribe({
      next: (response: any) => {
        this.messages = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al obtener mensajes',
          detail: 'No pudimos obtener el historial del chat, intente nuevamente...',
        });
      },
    });
  }

  sendMessage() {
    if (!this.message.trim()) {
      return;
    }

    const messageRequest = {
      mensaje: this.message,
      idUsuario: this.logedUser.id,
      idSala: this.chat.id,
    };

    this.messagesService.sendMessage(messageRequest).subscribe({
      next: (response: any) => {
        this.message = '';
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error',
          summary: 'Error al enviar mensaje',
          detail: 'No pudimos enviar tu mensaje, intente nuevamente...',
        });
      },
    });
  }

  openCloseChatDialog() {
    this.confirmationService.confirm({
      header: 'Finalizar chat',
      message: 'Por favor confirma como deseas finalizar el chat.',
      accept: () =>{
        if (this.delivered) {
          this.roomService.closeChat(this.chat.id, true).subscribe({
            next: () => {
              this.toasts.showToast({
                severity: 'success',
                summary: 'Chat finalizado',
                detail: 'Has finalizado el chat y marcado como entregado.',
              });
              this.location.back();
              this.chat.estado = 'ENTREGADO';
              this.roomService.reloadRooms();
            },
            error: () => {
              this.toasts.showToast({
                severity: 'error',
                summary: 'Error al finalizar chat',
                detail: 'No pudimos finalizar el chat, intente nuevamente...',
              });
            },
          });
        } else {
          this.roomService.closeChat(this.chat.id, false).subscribe({
            next: () => {
              this.toasts.showToast({
                severity: 'success',
                summary: 'Chat finalizado',
                detail: 'Has finalizado el chat y marcado como rechazado.',
              });
              this.location.back();
              this.chat.estado = 'RECHAZADO';
              this.roomService.reloadRooms();
            },
            error: () => {
              this.toasts.showToast({
                severity: 'error',
                summary: 'Error al finalizar chat',
                detail: 'No pudimos finalizar el chat, intente nuevamente...',
              });
            },
          });
        }
      },
      reject: () => {}
    });
  }
}
