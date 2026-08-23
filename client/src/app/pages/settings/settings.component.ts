import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-4xl mx-auto pb-24">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">Settings</h1>
        <p class="text-stone-500 mt-1">Manage your account credentials and security preferences</p>
      </div>

      <div class="space-y-6">
        
        <!-- Profile Visibility -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 flex justify-between items-center">
          <div>
            <h2 class="text-base font-bold text-stone-900">Profile visibility</h2>
            <p class="text-sm text-stone-500 mt-1">Make your profile visible to employers searching for talent</p>
          </div>
          <!-- Toggle -->
          <button class="w-12 h-6 rounded-full transition-colors relative active:scale-95"
                  [ngClass]="isVisible ? 'bg-brand-600' : 'bg-stone-200'"
                  (click)="isVisible = !isVisible">
            <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform"
                 [ngClass]="isVisible ? 'translate-x-7' : 'translate-x-1'"></div>
          </button>
        </div>

        <!-- NEW: Change Password Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h2 class="text-base font-bold text-stone-900 mb-2">Change password</h2>
          <p class="text-xs text-stone-500 mb-6">Ensure your new password is at least 8 characters long</p>
          
          <form [formGroup]="passwordForm" (ngSubmit)="onUpdatePassword()" class="space-y-5 max-w-md">
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Current password *</label>
              <input type="password" formControlName="current" placeholder="Enter current password" 
                class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
              <p *ngIf="passwordForm.get('current')?.touched && passwordForm.get('current')?.invalid" class="text-xs text-red-600 mt-1.5">
                Current password is required.
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">New password *</label>
              <input type="password" formControlName="new" placeholder="Enter new password (min 8 chars)"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
              <p *ngIf="passwordForm.get('new')?.touched && passwordForm.get('new')?.hasError('minlength')" class="text-xs text-red-600 mt-1.5">
                Password must be at least 8 characters.
              </p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Confirm new password *</label>
              <input type="password" formControlName="confirm" placeholder="Confirm new password"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
              <p *ngIf="passwordMismatch()" class="text-xs text-red-600 mt-1.5">
                Passwords do not match.
              </p>
            </div>

            <!-- Error message -->
            <div *ngIf="errorMessage()" class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {{ errorMessage() }}
            </div>

            <div class="flex items-center gap-4 pt-2">
              <button type="submit" [disabled]="isUpdating" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                <span *ngIf="isUpdating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Update password
              </button>
              <span *ngIf="passwordUpdated()" class="text-sm font-medium text-brand-700 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                Password updated successfully
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
            Your account has been scheduled for deletion.
          </p>
        </div>

      </div>
    </div>
  `
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  isVisible = false;
  isUpdating = false;
  passwordUpdated = signal(false);
  deleteRequested = signal(false);
  errorMessage = signal<string | null>(null);

  passwordForm = this.fb.group({
    current: ['', Validators.required],
    new: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required]
  });

  passwordMismatch(): boolean {
    const newPass = this.passwordForm.get('new')?.value;
    const confirmPass = this.passwordForm.get('confirm')?.value;
    return !!(confirmPass && newPass && newPass !== confirmPass);
  }

  onUpdatePassword() {
    this.errorMessage.set(null);

    if (this.passwordMismatch()) {
      return;
    }

    if (this.passwordForm.valid) {
      const currentPass = this.passwordForm.value.current!;
      const newPass = this.passwordForm.value.new!;

      this.isUpdating = true;
      this.auth.changePassword(currentPass, newPass).subscribe({
        next: () => {
          this.isUpdating = false;
          this.passwordForm.reset();
          this.passwordUpdated.set(true);
          setTimeout(() => this.passwordUpdated.set(false), 4000);
        },
        error: (err) => {
          this.isUpdating = false;
          this.errorMessage.set(err?.message || 'Failed to change password. Please check your current password.');
        }
      });
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
