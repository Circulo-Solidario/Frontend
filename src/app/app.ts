import { Component, signal } from '@angular/core';
import { CreateUser } from "./components/create-user/create-user";
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher';

@Component({
  selector: 'app-root',
  imports: [CreateUser, ThemeSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
