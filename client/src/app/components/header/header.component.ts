import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <!-- Logo -->
      <a routerLink="/" class="flex items-center gap-2">
        <div class="bg-indigo-600 text-white p-1.5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="16" height="16" x="4" y="4" rx="2" />
            <rect width="6" height="6" x="9" y="9" rx="1" />
            <path d="M9 15v2" />
            <path d="M15 15v2" />
          </svg>
        </div>
        <span class="text-xl font-bold text-gray-900 tracking-tight">CareerWise</span>
      </a>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <a routerLink="/jobs" routerLinkActive="text-indigo-600 font-medium" class="text-gray-500 hover:text-gray-900 transition-colors text-sm">Find Jobs</a>
        <a routerLink="/dashboard" routerLinkActive="text-indigo-600 font-medium" class="text-gray-500 hover:text-gray-900 transition-colors text-sm">Dashboard</a>
        <a routerLink="/employers" routerLinkActive="text-indigo-600 font-medium" class="text-gray-500 hover:text-gray-900 transition-colors text-sm">Employers</a>
        <a routerLink="/messages" routerLinkActive="text-indigo-600 font-medium" class="text-gray-500 hover:text-gray-900 transition-colors text-sm">Messages</a>
      </nav>

      <!-- Auth Actions -->
      <div class="flex items-center gap-4">
        <button class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Log in</button>
        <button class="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors shadow-sm">Sign up</button>
      </div>
    </header>
  `
})
export class HeaderComponent {}
