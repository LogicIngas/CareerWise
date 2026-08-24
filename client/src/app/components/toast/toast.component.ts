import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-[1000] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast-item pointer-events-auto flex items-start gap-3 bg-white border border-stone-200 rounded-xl shadow-lg shadow-stone-900/10 px-4 py-3.5"
        [ngClass]="{
          'border-l-4 border-l-emerald-500': toast.type === 'success',
          'border-l-4 border-l-red-500': toast.type === 'error',
          'border-l-4 border-l-blue-500': toast.type === 'info'
        }">
        <div class="flex-shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600">
            <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
          </svg>
          <svg *ngIf="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <svg *ngIf="toast.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <p class="flex-1 text-sm font-medium text-stone-800 leading-snug pt-0.5">{{ toast.text }}</p>
        <button
          type="button"
          (click)="toastService.dismiss(toast.id)"
          class="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors p-0.5"
          aria-label="Dismiss notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .toast-item {
      animation: toast-in 0.2s ease-out;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
