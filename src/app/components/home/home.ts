import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SplitButton } from 'primeng/splitbutton';
import { Toolbar } from 'primeng/toolbar';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { Drawer } from 'primeng/drawer';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    Toolbar,
    Button,
    SplitButton,
    IconField,
    InputIcon,
    InputText,
    RouterOutlet,
    PanelMenu,
    Drawer,
    ThemeSwitcher,
    CommonModule
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  isCollapsed = false;
  visible = false;
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Mail',
        icon: 'pi pi-envelope',
        items: [
          {
            label: 'Compose',
            icon: 'pi pi-file-edit'
          },
          {
            label: 'Inbox',
            icon: 'pi pi-inbox'
          },
          {
            label: 'Sent',
            icon: 'pi pi-send'
          },
          {
            label: 'Trash',
            icon: 'pi pi-trash'
          }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'Sales',
            icon: 'pi pi-chart-line'
          },
          {
            label: 'Products',
            icon: 'pi pi-list'
          }
        ]
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog'
          },
          {
            label: 'Privacy',
            icon: 'pi pi-shield'
          }
        ]
      }
    ];
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
