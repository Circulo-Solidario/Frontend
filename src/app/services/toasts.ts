import { Injectable } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Toasts {
  private toastSubject = new Subject<ToastMessageOptions>();
  toast$ = this.toastSubject.asObservable();

  showToast(message: ToastMessageOptions) {
    this.toastSubject.next(message);
  }
}
