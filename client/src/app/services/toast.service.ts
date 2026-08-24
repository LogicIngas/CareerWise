import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private counter = 0;
  private toastsSignal = signal<ToastMessage[]>([]);

  toasts = this.toastsSignal.asReadonly();

  show(text: string, type: ToastType = 'info', duration = 3500): void {
    const id = ++this.counter;
    this.toastsSignal.update(list => [...list, { id, type, text }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(text: string, duration?: number): void {
    this.show(text, 'success', duration);
  }

  error(text: string, duration?: number): void {
    this.show(text, 'error', duration);
  }

  info(text: string, duration?: number): void {
    this.show(text, 'info', duration);
  }

  dismiss(id: number): void {
    this.toastsSignal.update(list => list.filter(t => t.id !== id));
  }
}
