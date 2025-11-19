import { Component, HostListener, inject, OnInit } from '@angular/core';
import { LoginService } from '../../services/login';
import { Router, RouterOutlet } from '@angular/router';
import { PermissionsService } from '../../services/permissions';
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
  private permissionsService: PermissionsService = inject(PermissionsService);
  screenWidth: number = window.innerWidth;
  currentRoute: string = '';
  myProductsChats: any[] = [];
  myRequetsChats: any[] = [];
  logedUser: any;
  defaultTab = "0";
  canSeeMyProductsChats: boolean = false;
  canSeeMyRequestsChats: boolean = false;

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
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

      if(this.logedUser.roles.some((role: any) => role.id === 3)){
        this.canSeeMyRequestsChats = true;
        this.defaultTab = '1';
      }
      if(this.logedUser.roles.some((role: any) => role.id === 2)){
        this.canSeeMyProductsChats = true;        
      }
    });
    this.getRequesterRooms();
    this.getDonorRooms();
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
    this.currentRoute = this.router.url;
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

  shouldShowMobileVersion(): boolean {
    return this.currentRoute.includes('/principal/chats/mensajes') && this.screenWidth < 767;
  }

}
