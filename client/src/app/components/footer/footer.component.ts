import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-stone-50 pt-16 pb-8 px-6 md:px-12 border-t border-stone-100">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div class="col-span-1 md:col-span-1">
          <a routerLink="/" class="flex items-center gap-2 mb-4">
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
          <p class="text-stone-500 text-sm mb-6 leading-relaxed">
            CareerWise connects ambitious talent with the companies building the future.
          </p>
        </div>

        <div>
          <h4 class="font-bold text-stone-900 mb-4">For Candidates</h4>
          <ul class="space-y-3">
            <li><a routerLink="/jobs" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">Find Jobs</a></li>
            <li><a routerLink="/saved-jobs" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">Saved Jobs</a></li>
            <li><a routerLink="/applications" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">My Applications</a></li>
            <li><a routerLink="/profile" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">Profile</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-stone-900 mb-4">For Employers</h4>
          <ul class="space-y-3">
            <li><a routerLink="/post-job" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">Post a Job</a></li>
            <li><a routerLink="/employer-home" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">Employer Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-stone-900 mb-4">Account</h4>
          <ul class="space-y-3">
            <li><a routerLink="/signup" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">Sign Up</a></li>
            <li><a routerLink="/login" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">Log In</a></li>
            <li><a routerLink="/settings" class="text-stone-500 hover:text-brand-600 text-sm transition-colors">Settings</a></li>
          </ul>
        </div>
      </div>

      <div class="max-w-7xl mx-auto pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-stone-400 text-sm">&copy; 2026 CareerWise. All rights reserved.</p>
        <div class="flex gap-6">
          <span class="text-stone-300 text-sm cursor-not-allowed select-none">Privacy</span>
          <span class="text-stone-300 text-sm cursor-not-allowed select-none">Terms</span>
          <span class="text-stone-300 text-sm cursor-not-allowed select-none">Cookies</span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
