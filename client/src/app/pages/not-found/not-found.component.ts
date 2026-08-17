import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <div class="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </div>
      <p class="text-sm font-semibold text-brand-600 tracking-wide mb-3">404</p>
      <h1 class="text-3xl md:text-4xl font-bold text-stone-900 mb-4">This page took a wrong turn</h1>
      <p class="text-stone-500 max-w-md mb-10">The page you're looking for doesn't exist or may have moved. Let's get you back on track.</p>
      <div class="flex flex-col sm:flex-row gap-4">
        <a routerLink="/" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-medium py-3 px-8 rounded-xl transition-all shadow-sm">
          Back to home
        </a>
        <a routerLink="/jobs" class="border border-stone-200 hover:bg-stone-50 active:scale-[0.98] text-stone-700 font-medium py-3 px-8 rounded-xl transition-all">
          Browse jobs
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
