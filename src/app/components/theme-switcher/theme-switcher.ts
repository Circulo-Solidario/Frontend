import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  imports: [ToggleSwitchModule, FormsModule, CommonModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css'
})
export class ThemeSwitcher {
  checked: boolean = false;
  constructor(public themeService: ThemeService) {
    this.checked = themeService.isDarkTheme();
  }
}
