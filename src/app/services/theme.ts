import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;
  private readonly themeKey = 'primeNG-theme-mode';
  private themeChanged$ = new Subject<boolean>();

  constructor() {
    this.loadInitialTheme();
  }

  private loadInitialTheme(): void {
    const savedTheme = localStorage.getItem(this.themeKey);
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode = prefersDark;
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem(this.themeKey, this.isDarkMode ? 'dark' : 'light');
    this.themeChanged$.next(this.isDarkMode);
  }

  private applyTheme(): void {
    const htmlElement = document.documentElement;
    
    if (this.isDarkMode) {
      htmlElement.classList.add('dark-mode');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark-mode');
      htmlElement.setAttribute('data-theme', 'light');
    } 
  }

  isDarkTheme(): boolean {
    return this.isDarkMode;
  }

  onThemeChanged() {
    return this.themeChanged$.asObservable();
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.applyTheme();
    localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    this.themeChanged$.next(isDark);
  }
}
