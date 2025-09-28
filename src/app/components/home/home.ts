import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
    Menu
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  @ViewChild('op') op!: Popover;
  isCollapsed = false;
  fullyCollapsed = false;
  rotate = false;
  visible = false;
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Productos',
        icon: 'pi pi-gift',
        items: [
          {
            label: 'Publicar producto',
            icon: 'pi pi-plus',
          },
          {
            label: 'Ver solicitudes',
            icon: 'pi pi-comments',
          }
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
}
