import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { Toasts } from './services/toasts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('Círculo Solidario');

  private messageService: MessageService = inject(MessageService);
  private toastService: Toasts = inject(Toasts);

  ngOnInit(): void {
    this.toastService.toast$.subscribe(message => {
      this.showToast(message);
    });
  }

  showToast(message: ToastMessageOptions) {
    if (message) {
      this.messageService.add(message);
    }
  }
}
