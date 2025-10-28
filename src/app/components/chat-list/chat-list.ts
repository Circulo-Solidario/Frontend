import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../services/login';
import { Router, RouterOutlet } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { Rooms } from '../../services/rooms';
import { Toasts } from '../../services/toasts';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-chat-list',
  imports: [
    TabsModule,
    DataViewModule,
    DividerModule,
    AvatarModule,
    RouterOutlet
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
})
export class ChatList implements OnInit {
  private loginService: LoginService = inject(LoginService);
  private roomService: Rooms = inject(Rooms);
  private toasts: Toasts = inject(Toasts);
  private router: Router = inject(Router);
  myProductsChats: any[] = [];
  myRequetsChats: any[] = [];
  logedUser: any;
  defaultTab = "0";

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
        return;
      }
    });
    this.getRequesterRooms();
    this.getDonorRooms();
  }

  getRequesterRooms() {
    this.roomService.getRequesterRooms(this.logedUser?.id).subscribe({
      next: (response: any) => {
        this.myRequetsChats = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al obtener chats', detail: 'Error al obtener los chats que corresponden a sus solicitudes, intente nuevamente...'
        })
      }
    })
  }

  getDonorRooms() {
    this.roomService.getDonorRooms(this.logedUser?.id).subscribe({
      next: (response: any) => {
        this.myProductsChats = response;
      },
      error: () => {
        this.toasts.showToast({
          severity: 'error', summary: 'Error al obtener chats', detail: 'Error al obtener los chats que corresponden a las solicitudes de sus productos, intente nuevamente...'
        })
      }
    })
  }

  loadChat(chat: any) {
    this.roomService.setChat(chat);
    this.router.navigate(['/principal/chats/mensajes']);
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

}
