import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="min-h-screen grid lg:grid-cols-2">
      <!-- Form side -->
      <div class="flex flex-col px-6 py-8 md:px-16 md:py-12">
        <a routerLink="/" class="flex items-center gap-2">
          <div class="bg-brand-600 text-white p-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="16" height="16" x="4" y="4" rx="2" />
              <rect width="6" height="6" x="9" y="9" rx="1" />
              <path d="M9 15v2" />
              <path d="M15 15v2" />
            </svg>
          </div>
          <span class="text-xl font-bold text-stone-900 tracking-tight">CareerWise</span>
        </a>

        <main id="main-content" class="flex-grow flex items-center py-12">
          <div class="w-full max-w-sm mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- Visual side -->
      <div class="hidden lg:block relative bg-brand-800 bg-grain overflow-hidden">
        <img src="https://picsum.photos/seed/careerwise-auth/1200/1600" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-brand-900/10"></div>
        <div class="relative z-10 h-full flex flex-col justify-end p-12 xl:p-16">
          <p class="text-2xl font-medium text-white leading-snug mb-8 max-w-md">Everything you need to search smarter and hire faster — all in one place.</p>
          <div class="space-y-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center flex-shrink-0 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 4 15h9l-2 9 11-13h-9l3-7z"/></svg>
              </div>
              <p class="text-sm text-brand-100">Apply in one click with a smart, reusable profile</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center flex-shrink-0 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.275 1.275L3 12l5.8 1.9a2 2 0 0 1 1.275 1.275L12 21l1.9-5.8a2 2 0 0 1 1.275-1.275L21 12l-5.8-1.9a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <p class="text-sm text-brand-100">Get matched to roles that fit your skills, not just keywords</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center flex-shrink-0 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <p class="text-sm text-brand-100">Every employer on CareerWise is verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}
