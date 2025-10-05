import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { CommonModule } from '@angular/common';
import { TieredMenu } from 'primeng/tieredmenu';
import { Avatar } from 'primeng/avatar';
import { OverlayBadge } from 'primeng/overlaybadge';
import { Popover } from 'primeng/popover';
import { Menu } from 'primeng/menu';
import { LoginService } from '../../services/login';
import { Observable } from 'rxjs';
import { Badge } from 'primeng/badge';
import { Chip } from 'primeng/chip';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-home',
  imports: [
    Toolbar,
    Button,
    IconField,
    InputIcon,
    InputText,
    RouterOutlet,
    PanelMenu,
    Drawer,
    ThemeSwitcher,
    CommonModule,
    TieredMenu,
    Avatar,
    OverlayBadge,
    Popover,
    Menu,
    Badge,
    FormsModule
],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  @ViewChild('op') op!: Popover;
  private loginService: LoginService = inject(LoginService);
  private router: Router = inject(Router);
  loggedUser: any;
  isCollapsed = false;
  fullyCollapsed = false;
  rotate = false;
  visible = false;
  productName: string = '';
  menu: MenuItem[] = [];
  userMenu: MenuItem[] = [];

  ngOnInit() {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.loggedUser = user;
    });

    if (this.loggedUser == null) {
      this.router.navigate(['/login']);
    }
    this.userMenu = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: '/principal/editar-perfil',
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logOut();
        },
      },
    ];
    this.menu = [
      {
        label: 'Productos',
        icon: 'pi pi-gift',
        items: [
          {
            label: 'Publicar producto',
            icon: 'pi pi-plus',
            command: () => {
              this.router.navigate(['/principal/publicar-producto']);
              this.visible = false;
            },
          },
          {
            label: 'Ver solicitudes',
            icon: 'pi pi-comments',
          },
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'Mis estadísticas',
            icon: 'pi pi-chart-scatter',
          },
          {
            label: 'Estadísticas globales',
            icon: 'pi pi-chart-line',
          },
        ],
      },
      {
        label: 'Donaciones',
        icon: 'pi pi-heart',
        items: [
          {
            label: 'Ver donaciones',
            icon: 'pi pi-list',
          },
          {
            label: 'Ver organizaciones',
            icon: 'pi pi-home',
          },
        ],
      },
    ];
  }

  toggleSidebar() {
    this.rotate = true;
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      setTimeout(() => {
        this.fullyCollapsed = true;
      }, 225);
    } else {
      this.fullyCollapsed = false;
    }
    setTimeout(() => {
      this.rotate = false;
    }, 500);
  }

  toggle(event: any) {
    this.op.toggle(event);
  }

  goHome() {
    this.router.navigate(['/principal']);
    this.visible = false;
  }

  goEditProfile() {
    this.router.navigate(['/principal/editar-perfil']);
    this.visible = false;
  }

  logOut() {
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }

  searchProduct(key: KeyboardEvent){
    if(key.key != 'Enter' || this.productName == ''){
      return;
    }
    this.router.navigate(['/principal/busqueda'], {
      queryParams: { nombre: this.productName }
    });
    this.productName = '';
  }
}
