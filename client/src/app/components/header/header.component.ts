import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavLink {
  label: string;
  path: string;
  muted: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white border-b border-stone-100 px-6 md:px-12 sticky top-0 z-50">
      <div class="py-4 flex items-center justify-between">
        <!-- Logo -->
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

        <!-- Desktop navigation -->
        <nav class="hidden md:flex items-center gap-10">
          <a *ngFor="let link of navLinks()" [routerLink]="link.path" routerLinkActive="text-stone-900 after:scale-x-100"
            [class]="link.muted
              ? 'text-[13px] text-stone-400 hover:text-stone-600 transition-colors'
              : 'relative py-1 text-sm text-stone-500 hover:text-stone-900 transition-colors after:absolute after:left-0 after:-bottom-4 after:h-0.5 after:w-full after:bg-brand-600 after:scale-x-0 after:origin-left after:transition-transform'">
            {{ link.label }}
          </a>
        </nav>

        <!-- Desktop auth actions -->
        <div class="hidden md:flex items-center gap-3" *ngIf="!auth.isAuthenticated()">
          <button routerLink="/login" class="text-sm font-medium text-stone-700 hover:bg-stone-100 active:scale-[0.98] px-4 py-2 rounded-lg transition-all">Log in</button>
          <button routerLink="/signup" class="text-sm font-medium bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white px-5 py-2 rounded-lg transition-all shadow-sm shadow-brand-900/10">Sign up</button>
        </div>

        <div class="hidden md:flex items-center gap-3" *ngIf="auth.isAuthenticated()">
          <button [routerLink]="auth.role() === 'employer' ? '/employer-home' : '/dashboard'" class="text-sm font-medium text-stone-700 hover:bg-stone-100 active:scale-[0.98] px-4 py-2 rounded-lg transition-all">
            {{ auth.role() === 'employer' ? 'Employer Dashboard' : 'Dashboard' }}
          </button>
          <button (click)="logout()" class="text-sm font-medium bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-700 px-5 py-2 rounded-lg transition-all">
            Log out
          </button>
        </div>

        <!-- Mobile menu toggle -->
        <button type="button" (click)="mobileMenuOpen.set(!mobileMenuOpen())"
          [attr.aria-expanded]="mobileMenuOpen()" aria-controls="mobile-menu"
          [attr.aria-label]="mobileMenuOpen() ? 'Close menu' : 'Open menu'"
          class="md:hidden p-2 -mr-2 rounded-lg hover:bg-stone-100 active:scale-[0.98] transition-all text-stone-700">
          <svg *ngIf="!mobileMenuOpen()" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          <svg *ngIf="mobileMenuOpen()" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Mobile panel -->
      <div id="mobile-menu" class="md:hidden grid transition-[grid-template-rows] duration-300 ease-out"
        [ngClass]="mobileMenuOpen() ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
        <div class="overflow-hidden">
          <nav class="flex flex-col pt-1 pb-4">
            <a *ngFor="let link of navLinks()" [routerLink]="link.path" (click)="mobileMenuOpen.set(false)"
              routerLinkActive="text-brand-700 font-semibold" class="py-3 text-base text-stone-600 border-b border-stone-50 last:border-0">
              {{ link.label }}
            </a>
          </nav>

          <div class="pt-4 pb-2 border-t border-stone-100 flex flex-col gap-3" *ngIf="!auth.isAuthenticated()">
            <button routerLink="/login" (click)="mobileMenuOpen.set(false)" class="w-full text-center text-sm font-medium text-stone-700 hover:bg-stone-100 active:scale-[0.98] px-4 py-2.5 rounded-lg transition-all">Log in</button>
            <button routerLink="/signup" (click)="mobileMenuOpen.set(false)" class="w-full text-center text-sm font-medium bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-lg transition-all shadow-sm shadow-brand-900/10">Sign up</button>
          </div>

          <div class="pt-4 pb-2 border-t border-stone-100 flex flex-col gap-3" *ngIf="auth.isAuthenticated()">
            <button [routerLink]="auth.role() === 'employer' ? '/employer-home' : '/dashboard'" (click)="mobileMenuOpen.set(false)" class="w-full text-center text-sm font-medium text-stone-700 hover:bg-stone-100 active:scale-[0.98] px-4 py-2.5 rounded-lg transition-all">
              {{ auth.role() === 'employer' ? 'Employer Dashboard' : 'Dashboard' }}
            </button>
            <button (click)="logout(); mobileMenuOpen.set(false)" class="w-full text-center text-sm font-medium bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-700 px-5 py-2.5 rounded-lg transition-all">
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  protected auth = inject(AuthService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);

  navLinks = computed<NavLink[]>(() => {
    if (!this.auth.isAuthenticated()) {
      return [
        { label: 'Find Jobs', path: '/jobs', muted: false },
        { label: 'For Employers', path: '/employer-home', muted: true }
      ];
    }
    return [{ label: 'Find Jobs', path: '/jobs', muted: false }];
  });

  @HostListener('document:keydown.escape')
  onEscape() {
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
