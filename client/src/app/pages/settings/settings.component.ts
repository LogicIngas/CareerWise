import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-4xl mx-auto pb-24">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">Settings</h1>
        <p class="text-stone-500 mt-1">Manage your account preferences</p>
      </div>

      <div class="space-y-6">
        
        <!-- Profile Visibility -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 flex justify-between items-center">
          <div>
            <h2 class="text-base font-bold text-stone-900">Profile visibility</h2>
            <p class="text-sm text-stone-500 mt-1">Make your profile visible to employers</p>
          </div>
          <!-- Toggle -->
          <button class="w-12 h-6 rounded-full transition-colors relative active:scale-95"
                  [ngClass]="isVisible ? 'bg-brand-600' : 'bg-stone-200'"
                  (click)="isVisible = !isVisible">
            <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform"
                 [ngClass]="isVisible ? 'translate-x-7' : 'translate-x-1'"></div>
          </button>
        </div>

        <!-- Change Password -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h2 class="text-base font-bold text-stone-900 mb-6">Change password</h2>
          
          <form [formGroup]="passwordForm" (ngSubmit)="onUpdatePassword()" class="space-y-5 max-w-md">
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Current password</label>
              <input type="password" formControlName="current" placeholder="********" 
                class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">New password</label>
              <input type="password" formControlName="new" placeholder="********"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
              <p *ngIf="passwordForm.get('new')?.touched && passwordForm.get('new')?.hasError('minlength')" class="text-xs text-red-600 mt-1.5">
                Password must be at least 8 characters.
              </p>
            </div>

            <div class="flex items-center gap-4">
              <button type="submit" [disabled]="isUpdating" class="border border-stone-200 hover:bg-stone-50 active:scale-[0.98] text-stone-700 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                <span *ngIf="isUpdating" class="w-4 h-4 border-2 border-brand-600/30 border-t-brand-600 rounded-full animate-spin"></span>
                Update password
              </button>
              <span *ngIf="passwordUpdated()" class="text-sm font-medium text-brand-700 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                Password updated
              </span>
            </div>
          </form>
        </div>

        <!-- Danger Zone -->
        <div class="bg-red-50/50 rounded-2xl shadow-sm border border-red-100 p-8">
          <h2 class="text-base font-bold text-red-600 mb-2">Danger zone</h2>
          <p class="text-sm text-stone-600 mb-6">Permanently delete your account and all data.</p>

          <button (click)="onDeleteAccount()" class="bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
            Delete account
          </button>
          <p *ngIf="deleteRequested()" class="text-sm text-red-700 mt-4">
            Your account has been scheduled for deletion (mock).
          </p>
        </div>

      </div>
    </div>
  `
})
export class SettingsComponent {
  private fb = inject(FormBuilder);

  isVisible = false;
  isUpdating = false;
  passwordUpdated = signal(false);
  deleteRequested = signal(false);

  passwordForm = this.fb.group({
    current: ['', Validators.required],
    new: ['', [Validators.required, Validators.minLength(8)]]
  });

  onUpdatePassword() {
    if (this.passwordForm.valid) {
      this.isUpdating = true;
      setTimeout(() => {
        this.isUpdating = false;
        this.passwordForm.reset();
        this.passwordUpdated.set(true);
        setTimeout(() => this.passwordUpdated.set(false), 3000);
      }, 800);
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  onDeleteAccount() {
    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      this.deleteRequested.set(true);
    }
  }
}
