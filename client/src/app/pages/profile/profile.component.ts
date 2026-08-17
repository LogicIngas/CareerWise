import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobSeekerService } from '../../services/job-seeker.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto pb-20">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">My Profile</h1>
        <p class="text-stone-500 mt-1">Manage your personal information and skills</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8" *ngIf="profile()">
        
        <!-- Left Column: Profile Card -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md shadow-brand-900/10">
              {{ initials() }}
            </div>
            <h2 class="text-xl font-bold text-stone-900 mb-1">{{profile().firstName}} {{profile().lastName}}</h2>
            <p class="text-stone-500 text-sm mb-6">{{profile().title}}</p>
            
            <div class="w-full space-y-3 text-sm text-stone-600 mb-8 text-left">
              <div class="flex items-center gap-3">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {{profile().location}}
              </div>
              <div class="flex items-center gap-3">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                {{profile().email}}
              </div>
              <div class="flex items-center gap-3">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {{profile().phone}}
              </div>
            </div>
            
            <button class="w-full py-2.5 px-4 border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Edit photo
            </button>
          </div>
        </div>

        <!-- Right Column: Forms -->
        <div class="md:col-span-2 space-y-6">
          
          <!-- Personal Information Form -->
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

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                  <input type="email" formControlName="email" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Phone</label>
                  <input type="text" formControlName="phone" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Professional summary</label>
                <textarea formControlName="summary" rows="4" class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm resize-y"></textarea>
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
              </div>
            </form>
          </div>

          <!-- Skills Section -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-stone-900">Skills</h2>
              <button class="text-sm font-medium text-stone-500 hover:text-brand-600 active:scale-95 flex items-center gap-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <span *ngFor="let skill of profile().skills" class="px-3 py-1.5 bg-brand-50 text-brand-700 text-xs font-semibold rounded-md border border-brand-100">
                {{skill}}
              </span>
              <p *ngIf="profile().skills.length === 0" class="text-sm text-stone-500">No skills added yet.</p>
            </div>
          </div>

          <!-- Education Section -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 class="text-lg font-bold text-stone-900 mb-6">Education</h2>

            <div class="space-y-5">
              <div *ngFor="let edu of profile().educations" class="flex flex-col">
                <h3 class="font-bold text-stone-900 text-sm">{{edu.degree}}<span *ngIf="edu.fieldOfStudy"> in {{edu.fieldOfStudy}}</span></h3>
                <p class="text-sm text-stone-600">{{edu.institution}}</p>
                <p class="text-xs text-stone-400" *ngIf="edu.startDate || edu.endDate">{{edu.startDate}} – {{edu.endDate || 'Present'}}</p>
              </div>
              <p *ngIf="profile().educations.length === 0" class="text-sm text-stone-500">No education added yet.</p>
            </div>
          </div>

        </div>
      </div>
      
      <div *ngIf="loading()" class="py-12 text-center text-stone-500 animate-pulse">
        Loading profile...
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private jobSeekerService = inject(JobSeekerService);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  profile = signal<any>(null);
  loading = signal(true);
  isSaving = false;
  justSaved = signal(false);

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    summary: ['']
  });

  ngOnInit() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) {
      this.loading.set(false);
      return;
    }

    this.jobSeekerService.getById(userId).subscribe(jobSeeker => {
      const user = this.auth.currentUser();
      let firstName = jobSeeker?.firstName ?? '';
      let lastName = jobSeeker?.lastName ?? '';
      if (user?.name) {
        const [fn, ...rest] = user.name.trim().split(/\s+/);
        firstName = fn || firstName;
        lastName = rest.join(' ') || lastName;
      }
      const data = {
        firstName,
        lastName,
        email: user?.email ?? jobSeeker?.email ?? '',
        location: user?.location || jobSeeker?.location || '',
        title: user?.currentTitle || jobSeeker?.headline || '',
        phone: jobSeeker?.phoneNumber ?? '',
        summary: jobSeeker?.summary ?? '',
        skills: (jobSeeker?.skills ?? []).map(s => s.name),
        educations: jobSeeker?.educations ?? []
      };
      this.profile.set(data);
      this.profileForm.patchValue(data);
      this.loading.set(false);
    });
  }

  initials(): string {
    const p = this.profile();
    if (!p) return '?';
    return `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  }

  onSave() {
    if (this.profileForm.valid) {
      this.isSaving = true;
      setTimeout(() => {
        this.profile.update(p => ({ ...p, ...this.profileForm.value }));
        this.isSaving = false;
        this.justSaved.set(true);
        setTimeout(() => this.justSaved.set(false), 3000);
      }, 800);
    }
  }
}
