import { Component, inject } from '@angular/core';
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
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      <div class="space-y-6">
        
        <!-- Profile Visibility -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-between items-center">
          <div>
            <h2 class="text-base font-bold text-gray-900">Profile visibility</h2>
            <p class="text-sm text-gray-500 mt-1">Make your profile visible to employers</p>
          </div>
          <!-- Toggle -->
          <button class="w-12 h-6 rounded-full transition-colors relative"
                  [ngClass]="isVisible ? 'bg-indigo-600' : 'bg-gray-200'"
                  (click)="isVisible = !isVisible">
            <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform"
                 [ngClass]="isVisible ? 'translate-x-7' : 'translate-x-1'"></div>
          </button>
        </div>

        <!-- Change Password -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-base font-bold text-gray-900 mb-6">Change password</h2>
          
          <form [formGroup]="passwordForm" (ngSubmit)="onUpdatePassword()" class="space-y-5 max-w-md">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Current password</label>
              <input type="password" formControlName="current" placeholder="********" 
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 text-sm">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">New password</label>
              <input type="password" formControlName="new" placeholder="********" 
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 text-sm">
            </div>

            <button type="submit" [disabled]="isUpdating" class="border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
              <span *ngIf="isUpdating" class="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></span>
              Update password
            </button>
          </form>
        </div>

        <!-- Danger Zone -->
        <div class="bg-red-50/50 rounded-2xl shadow-sm border border-red-100 p-8">
          <h2 class="text-base font-bold text-red-600 mb-2">Danger zone</h2>
          <p class="text-sm text-gray-600 mb-6">Permanently delete your account and all data.</p>
          
          <button (click)="onDeleteAccount()" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
            Delete account
          </button>
        </div>

      </div>
    </div>
  `
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  
  isVisible = false;
  isUpdating = false;

  passwordForm = this.fb.group({
    current: ['', Validators.required],
    new: ['', [Validators.required, Validators.minLength(8)]]
  });

  onUpdatePassword() {
    if (this.passwordForm.valid) {
      this.isUpdating = true;
      setTimeout(() => {
        this.isUpdating = false;
        alert('Password updated successfully (Mock)');
        this.passwordForm.reset();
      }, 800);
    }
  }

  onDeleteAccount() {
    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deleted (Mock)');
    }
  }
}
