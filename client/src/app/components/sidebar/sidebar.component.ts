import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 bg-white border-r border-stone-100 h-screen sticky top-0 flex flex-col pt-6 pb-4">
      <div class="px-6 mb-8">
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
      </div>

      <div class="flex-grow overflow-y-auto px-4 custom-scrollbar">
        <div class="mb-6" *ngIf="auth.role() === 'candidate'">
          <h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider px-2 mb-2">Candidate</h4>
          <nav class="space-y-1">
            <a routerLink="/dashboard" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              Dashboard
            </a>
            <a routerLink="/jobs" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Find Jobs
            </a>
            <a routerLink="/saved-jobs" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              Saved Jobs
            </a>
            <a routerLink="/applications" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              Applications
            </a>
            <a routerLink="/notifications" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              Notifications
            </a>
            <a routerLink="/profile" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </a>
          </nav>
        </div>

        <div class="mb-6" *ngIf="auth.role() === 'employer'">
          <h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider px-2 mb-2">Employer</h4>
          <nav class="space-y-1">
            <a routerLink="/employer-home" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
              Employer Home
            </a>
            <a routerLink="/post-job" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
              Post a Job
            </a>
          </nav>
        </div>
      </div>

      <div class="px-4 mt-auto">
        <h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider px-2 mb-2">Account</h4>
        <nav class="space-y-1 mb-2">
          <a routerLink="/settings" routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]" class="flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg text-stone-600 hover:bg-stone-50 hover:translate-x-0.5 transition-all text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Settings
          </a>
        </nav>
        <a routerLink="/profile" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
          <div class="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {{ initials() }}
          </div>
          <div class="text-left min-w-0">
            <p class="text-sm font-semibold text-stone-900 leading-none mb-1 truncate">{{ auth.currentUser()?.name || 'Account' }}</p>
            <p class="text-xs text-stone-500 leading-none truncate">{{ auth.currentUser()?.email }}</p>
          </div>
        </a>
        <button (click)="logout()" class="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-stone-500 hover:bg-stone-50 hover:text-red-600 transition-all text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          Log out
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  protected auth = inject(AuthService);
  private router = inject(Router);

  initials(): string {
    const name = this.auth.currentUser()?.name ?? '';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    return parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
