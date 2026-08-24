import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployerService, BackendEmployerFull } from '../../services/employer.service';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto pb-20">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">Company Profile</h1>
        <p class="text-stone-500 mt-1">Manage your company information and branding</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8" *ngIf="profile()">

        <!-- Left Column: Company Card -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md shadow-brand-900/10">
              {{ companyInitial() }}
            </div>
            <h2 class="text-xl font-bold text-stone-900 mb-1">{{ $any(profile()).companyName || 'Your Company' }}</h2>
            <p class="text-stone-500 text-sm mb-2">{{ $any(profile()).industry || 'Industry' }}</p>
            <p class="text-stone-400 text-xs mb-6">{{ $any(profile()).companyHeadquarters || 'Location' }}</p>

            <div class="w-full space-y-3 text-sm text-stone-600 mb-6 text-left">
              <div class="flex items-center gap-3" *ngIf="$any(profile()).email">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                {{ $any(profile()).email }}
              </div>
              <div class="flex items-center gap-3" *ngIf="$any(profile()).companyWebsite">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <a [href]="$any(profile()).companyWebsite" target="_blank" class="hover:text-brand-600 transition-colors truncate">{{ $any(profile()).companyWebsite }}</a>
              </div>
              <div class="flex items-center gap-3" *ngIf="$any(profile()).companySize">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {{ $any(profile()).companySize }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Forms -->
        <div class="md:col-span-2 space-y-6">

          <!-- Personal Information -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 class="text-lg font-bold text-stone-900 mb-6">Personal information</h2>

            <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">First name</label>
                  <input type="text" formControlName="firstName" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Last name</label>
                  <input type="text" formControlName="lastName" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                <input type="email" formControlName="email" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
              </div>

              <div class="flex items-center gap-4">
                <button type="submit" [disabled]="isSaving" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                  <span *ngIf="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Save changes
                </button>
                <span *ngIf="justSaved()" class="text-sm font-medium text-brand-700 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  Changes saved
                </span>
                <span *ngIf="errorMessage()" class="text-sm font-medium text-red-600">{{ errorMessage() }}</span>
              </div>
            </form>
          </div>

          <!-- Company Information -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 class="text-lg font-bold text-stone-900 mb-6">Company information</h2>

            <form [formGroup]="companyForm" (ngSubmit)="onSaveCompany()" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Company name</label>
                <input type="text" formControlName="companyName" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Industry</label>
                  <input type="text" formControlName="industry" placeholder="e.g. Technology, Healthcare" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Company size</label>
                  <div class="relative">
                    <select formControlName="companySize" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 text-sm appearance-none bg-white">
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                    <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Company website</label>
                <input type="url" formControlName="companyWebsite" placeholder="https://example.com" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
              </div>

              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Headquarters</label>
                <input type="text" formControlName="companyHeadquarters" placeholder="City, Country" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
              </div>

              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Company description</label>
                <textarea formControlName="companyDescription" rows="4" placeholder="Tell candidates about your company..." class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm resize-y placeholder-stone-400"></textarea>
              </div>

              <div class="flex items-center gap-4">
                <button type="submit" [disabled]="isSavingCompany" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                  <span *ngIf="isSavingCompany" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Save company info
                </button>
                <span *ngIf="justSavedCompany()" class="text-sm font-medium text-brand-700 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  Changes saved
                </span>
                <span *ngIf="errorMessageCompany()" class="text-sm font-medium text-red-600">{{ errorMessageCompany() }}</span>
              </div>
            </form>
          </div>

        </div>
      </div>

      <div *ngIf="loading()" class="py-12 text-center text-stone-500 animate-pulse">
        Loading profile...
      </div>
    </div>
  `
})
export class EmployerProfileComponent implements OnInit {
  private employerService = inject(EmployerService);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  profile = signal<BackendEmployerFull | null>(null);
  loading = signal(true);
  isSaving = false;
  justSaved = signal(false);
  errorMessage = signal<string | null>(null);
  isSavingCompany = false;
  justSavedCompany = signal(false);
  errorMessageCompany = signal<string | null>(null);

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  companyForm = this.fb.group({
    companyName: [''],
    industry: [''],
    companySize: [''],
    companyWebsite: [''],
    companyHeadquarters: [''],
    companyDescription: ['']
  });

  ngOnInit() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) {
      this.loading.set(false);
      return;
    }

    this.employerService.getById(userId).subscribe((employer: BackendEmployerFull | null) => {
      if (!employer) {
        this.loading.set(false);
        return;
      }
      this.profile.set(employer);
      this.profileForm.patchValue({
        firstName: employer.firstName ?? '',
        lastName: employer.lastName ?? '',
        email: employer.email ?? ''
      });
      this.companyForm.patchValue({
        companyName: employer.companyName ?? '',
        industry: employer.industry ?? '',
        companySize: employer.companySize ?? '',
        companyWebsite: employer.companyWebsite ?? '',
        companyHeadquarters: employer.companyHeadquarters ?? '',
        companyDescription: employer.companyDescription ?? ''
      });
      this.loading.set(false);
    });
  }

  companyInitial(): string {
    const name = this.profile()?.companyName ?? '';
    return name.charAt(0).toUpperCase() || '?';
  }

  onSave() {
    if (this.profileForm.valid && this.profile()) {
      this.isSaving = true;
      this.errorMessage.set(null);
      const updated: BackendEmployerFull = {
        ...this.profile()!,
        ...this.profileForm.value
      } as BackendEmployerFull;

      this.employerService.update(updated).subscribe({
        next: (result: BackendEmployerFull | null) => {
          this.isSaving = false;
          if (!result) {
            this.errorMessage.set('Could not save changes. Please try again.');
            return;
          }
          this.profile.set(result);
          this.auth.refreshUser({
            name: [result.firstName, result.lastName].filter(Boolean).join(' ').trim(),
            email: result.email,
            companyName: result.companyName
          } as Partial<AuthUser>);
          this.justSaved.set(true);
          setTimeout(() => this.justSaved.set(false), 3000);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage.set(err?.error?.message || 'Could not save changes. Please try again.');
        }
      });
    }
  }

  onSaveCompany() {
    if (this.profile()) {
      this.isSavingCompany = true;
      this.errorMessageCompany.set(null);
      const updated: BackendEmployerFull = {
        ...this.profile()!,
        ...this.companyForm.value
      } as BackendEmployerFull;

      this.employerService.update(updated).subscribe({
        next: (result: BackendEmployerFull | null) => {
          this.isSavingCompany = false;
          if (!result) {
            this.errorMessageCompany.set('Could not save changes. Please try again.');
            return;
          }
          this.profile.set(result);
          this.auth.refreshUser({
            name: [result.firstName, result.lastName].filter(Boolean).join(' ').trim(),
            companyName: result.companyName
          } as Partial<AuthUser>);
          this.justSavedCompany.set(true);
          setTimeout(() => this.justSavedCompany.set(false), 3000);
        },
        error: () => {
          this.isSavingCompany = false;
          this.errorMessageCompany.set('Could not save changes. Please try again.');
        }
      });
    }
  }
}
