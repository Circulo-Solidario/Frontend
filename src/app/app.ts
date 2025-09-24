import { Component, signal } from '@angular/core';
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ThemeSwitcher, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
