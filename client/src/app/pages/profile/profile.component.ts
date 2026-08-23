import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobSeekerService, BackendSkill, BackendEducation } from '../../services/job-seeker.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto pb-20">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">My Profile</h1>
        <p class="text-stone-500 mt-1">Manage your personal information, skills, and education</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8" *ngIf="profile()">
        
        <!-- Left Column: Profile Card -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 flex flex-col items-center text-center sticky top-24">
            <div class="w-24 h-24 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md shadow-brand-900/10">
              {{ initials() }}
            </div>
            <h2 class="text-xl font-bold text-stone-900 mb-1">{{profileForm.value.firstName}} {{profileForm.value.lastName}}</h2>
            <p class="text-stone-500 text-sm mb-6">{{profileForm.value.headline || 'Jobseeker'}}</p>
            
            <div class="w-full space-y-3 text-sm text-stone-600 mb-6 text-left">
              <div class="flex items-center gap-3">
                <svg class="text-stone-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="truncate">{{profileForm.value.location || 'Location not set'}}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg class="text-stone-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span class="truncate">{{profileForm.value.email}}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg class="text-stone-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span class="truncate">{{profileForm.value.phoneNumber || 'No phone added'}}</span>
              </div>
            </div>
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
                  <label class="block text-sm font-semibold text-stone-700 mb-2">First name *</label>
                  <input type="text" formControlName="firstName" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Last name *</label>
                  <input type="text" formControlName="lastName" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                  <input type="email" formControlName="email" [readonly]="true" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-sm cursor-not-allowed">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Phone number</label>
                  <input type="text" formControlName="phoneNumber" placeholder="+1 (555) 000-0000" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                  <p *ngIf="profileForm.get('phoneNumber')?.touched && profileForm.get('phoneNumber')?.invalid" class="text-xs text-red-600 mt-1">Please enter a valid phone number</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Location</label>
                  <input type="text" formControlName="location" placeholder="e.g. San Francisco, CA or Remote" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-stone-700 mb-2">Headline / Current Title</label>
                  <input type="text" formControlName="headline" placeholder="e.g. Senior Frontend Engineer" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Professional summary</label>
                <textarea formControlName="summary" rows="4" placeholder="Describe your experience and career goals..." class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm resize-y"></textarea>
              </div>

              <div class="flex items-center gap-4 pt-2">
                <button type="submit" [disabled]="isSaving" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                  <span *ngIf="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Save changes
                </button>
                <span *ngIf="justSaved()" class="text-sm font-medium text-brand-700 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  Changes saved successfully
                </span>
              </div>
            </form>
          </div>

          <!-- Skills Section with Tag Input -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 class="text-lg font-bold text-stone-900 mb-2">Skills</h2>
            <p class="text-xs text-stone-500 mb-4">Add skills that highlight your technical and domain expertise</p>

            <div class="flex gap-2 mb-4">
              <input
                type="text"
                [(ngModel)]="newSkillName"
                (keydown.enter)="addSkill($event)"
                placeholder="e.g. TypeScript, React, Python..."
                class="flex-1 px-4 py-2 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm text-stone-900">
              <button
                type="button"
                (click)="addSkill()"
                class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-all">
                Add Skill
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <span *ngFor="let skill of skillsList(); let i = index" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 text-xs font-semibold rounded-lg border border-brand-200/60 group">
                {{ skill.name }}
                <button type="button" (click)="removeSkill(i)" class="text-brand-400 hover:text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
              <p *ngIf="skillsList().length === 0" class="text-sm text-stone-400">No skills added yet.</p>
            </div>
          </div>

          <!-- Education Section (Add / Remove) -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-lg font-bold text-stone-900">Education</h2>
                <p class="text-xs text-stone-500 mt-0.5">Your academic credentials and degrees</p>
              </div>
              <button
                type="button"
                (click)="showAddEduForm.set(!showAddEduForm())"
                class="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add Education
              </button>
            </div>

            <!-- New Education Form -->
            <div *ngIf="showAddEduForm()" class="bg-stone-50 p-5 rounded-xl border border-stone-200 mb-6 space-y-4">
              <h3 class="text-sm font-bold text-stone-800">New Education Entry</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">Degree *</label>
                  <input type="text" [(ngModel)]="newEdu.degree" placeholder="e.g. B.S. in Computer Science" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">Institution *</label>
                  <input type="text" [(ngModel)]="newEdu.institution" placeholder="e.g. Stanford University" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">Field of Study</label>
                  <input type="text" [(ngModel)]="newEdu.fieldOfStudy" placeholder="e.g. Software Engineering" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">Year / Dates</label>
                  <input type="text" [(ngModel)]="newEdu.description" placeholder="e.g. 2018 – 2022" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button type="button" (click)="showAddEduForm.set(false)" class="px-4 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg">Cancel</button>
                <button type="button" (click)="addEducation()" class="px-4 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700">Add Entry</button>
              </div>
            </div>

            <!-- Education List -->
            <div class="space-y-4">
              <div *ngFor="let edu of educationsList(); let i = index" class="p-4 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/40 flex justify-between items-start transition-all">
                <div>
                  <h3 class="font-bold text-stone-900 text-sm">{{edu.degree}} <span *ngIf="edu.fieldOfStudy" class="font-normal text-stone-600">in {{edu.fieldOfStudy}}</span></h3>
                  <p class="text-xs text-stone-600 mt-0.5">{{edu.institution}}</p>
                  <p class="text-xs text-stone-400 mt-1" *ngIf="edu.description || edu.startDate">{{edu.description || edu.startDate}}</p>
                </div>
                <button type="button" (click)="removeEducation(i)" class="text-stone-400 hover:text-red-600 p-1 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <p *ngIf="educationsList().length === 0" class="text-sm text-stone-400">No education entries added yet.</p>
            </div>
          </div>

        </div>
      </div>
      
      <div *ngIf="loading()" class="py-16 text-center text-stone-500 animate-pulse">
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
  skillsList = signal<BackendSkill[]>([]);
  educationsList = signal<BackendEducation[]>([]);
  loading = signal(true);
  isSaving = false;
  justSaved = signal(false);

  newSkillName = '';
  showAddEduForm = signal(false);
  newEdu: BackendEducation = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    description: ''
  };

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    location: [''],
    headline: [''],
    summary: ['']
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    const userId = user?.userId;
    if (!userId) {
      this.loading.set(false);
      return;
    }

    this.jobSeekerService.getById(userId).subscribe(jobSeeker => {
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
        location: jobSeeker?.location || user?.location || '',
        headline: jobSeeker?.headline || user?.currentTitle || '',
        phoneNumber: jobSeeker?.phoneNumber || '',
        summary: jobSeeker?.summary ?? ''
      };

      this.skillsList.set(jobSeeker?.skills ?? []);
      this.educationsList.set(jobSeeker?.educations ?? []);

      this.profile.set(data);
      this.profileForm.patchValue(data);
      this.loading.set(false);
    });
  }

  initials(): string {
    const fn = this.profileForm.value.firstName || '';
    const ln = this.profileForm.value.lastName || '';
    return `${fn[0] ?? ''}${ln[0] ?? ''}`.toUpperCase() || 'U';
  }

  addSkill(event?: Event) {
    if (event) event.preventDefault();
    const name = this.newSkillName.trim();
    if (!name) return;
    const current = this.skillsList();
    if (!current.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      this.skillsList.set([...current, { name, category: 'Technical', yearsOfExperience: 1 }]);
    }
    this.newSkillName = '';
  }

  removeSkill(index: number) {
    const list = [...this.skillsList()];
    list.splice(index, 1);
    this.skillsList.set(list);
  }

  addEducation() {
    if (!this.newEdu.degree.trim() || !this.newEdu.institution.trim()) return;
    this.educationsList.set([...this.educationsList(), { ...this.newEdu }]);
    this.newEdu = { institution: '', degree: '', fieldOfStudy: '', description: '' };
    this.showAddEduForm.set(false);
  }

  removeEducation(index: number) {
    const list = [...this.educationsList()];
    list.splice(index, 1);
    this.educationsList.set(list);
  }

  onSave() {
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const userId = this.auth.currentUser()?.userId;
    if (!userId) return;

    this.isSaving = true;

    const payload = {
      userId,
      firstName: this.profileForm.value.firstName ?? '',
      lastName: this.profileForm.value.lastName ?? '',
      phoneNumber: this.profileForm.value.phoneNumber ?? '',
      location: this.profileForm.value.location ?? '',
      headline: this.profileForm.value.headline ?? '',
      summary: this.profileForm.value.summary ?? '',
      skills: this.skillsList(),
      educations: this.educationsList()
    };

    this.jobSeekerService.updateProfile(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res) {
          this.skillsList.set(res.skills ?? this.skillsList());
          this.educationsList.set(res.educations ?? this.educationsList());
        }
        this.auth.refreshUser({
          name: `${payload.firstName} ${payload.lastName}`.trim(),
          location: payload.location,
          currentTitle: payload.headline
        });
        this.justSaved.set(true);
        setTimeout(() => this.justSaved.set(false), 3000);
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        this.isSaving = false;
      }
    });
  }
}
