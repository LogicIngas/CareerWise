import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobSeekerService, BackendSkill, BackendEducation, BackendExperience } from '../../services/job-seeker.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { SanitizeUrlPipe } from '../../pipes/sanitize-url.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SanitizeUrlPipe],
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
                  <input type="email" formControlName="email" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
                  <p *ngIf="profileForm.get('email')?.touched && profileForm.get('email')?.invalid" class="text-xs text-red-600 mt-1">Please enter a valid email address</p>
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

          <!-- Resume / CV Section -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 class="text-lg font-bold text-stone-900 mb-2">Resume / CV</h2>
            <p class="text-xs text-stone-500 mb-4">Attach a PDF, DOC, or DOCX file so employers can review your resume (max 5MB)</p>

            <div *ngIf="resumeFileName()" class="flex items-center justify-between gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/60 mb-4">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                </div>
                <span class="text-sm font-semibold text-stone-800 truncate">{{ resumeFileName() }}</span>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <button type="button" (click)="showResumePreview.set(!showResumePreview())" class="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  {{ showResumePreview() ? 'Hide Preview' : 'View CV' }}
                </button>
                <button type="button" (click)="removeResume()" [disabled]="isDeletingResume" class="text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors disabled:opacity-50">
                  Remove
                </button>
              </div>
            </div>

            <!-- Inline CV Preview -->
            <div *ngIf="showResumePreview() && resumeUrl()" class="mb-4 rounded-xl overflow-hidden border border-stone-200">
              <iframe
                [src]="resumeUrl() | sanitizeUrl"
                width="100%"
                height="600"
                class="block"
                title="Resume Preview">
              </iframe>
            </div>

            <label class="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-stone-200 hover:border-brand-400 rounded-xl cursor-pointer transition-colors text-sm font-semibold text-stone-600 hover:text-brand-700">
              <svg *ngIf="!isUploadingResume" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span *ngIf="isUploadingResume" class="w-4 h-4 border-2 border-stone-300 border-t-brand-600 rounded-full animate-spin"></span>
              {{ isUploadingResume ? 'Uploading...' : (resumeFileName() ? 'Replace file' : 'Upload your CV') }}
              <input type="file" class="hidden" accept=".pdf,.doc,.docx" [disabled]="isUploadingResume" (change)="onResumeSelected($event)">
            </label>
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
              <div>
                <label class="block text-xs font-semibold text-stone-700 mb-1">Field of Study</label>
                <input type="text" [(ngModel)]="newEdu.fieldOfStudy" placeholder="e.g. Software Engineering" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">Start Date</label>
                  <input type="date" [(ngModel)]="newEdu.startDate" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">End Date</label>
                  <input type="date" [(ngModel)]="newEdu.endDate" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea rows="2" [(ngModel)]="newEdu.description" placeholder="Notable coursework, achievements, activities..." class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm resize-y"></textarea>
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
                  <p class="text-xs text-stone-400 mt-1" *ngIf="edu.startDate || edu.endDate">{{edu.startDate}}{{edu.startDate && edu.endDate ? ' – ' : ''}}{{edu.endDate}}</p>
                  <p class="text-xs text-stone-500 mt-1" *ngIf="edu.description">{{edu.description}}</p>
                </div>
                <button type="button" (click)="removeEducation(i)" class="text-stone-400 hover:text-red-600 p-1 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <p *ngIf="educationsList().length === 0" class="text-sm text-stone-400">No education entries added yet.</p>
            </div>
          </div>

          <!-- Work Experience Section (Add / Remove) -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-lg font-bold text-stone-900">Work Experience</h2>
                <p class="text-xs text-stone-500 mt-0.5">Your professional work history</p>
              </div>
              <button
                type="button"
                (click)="showAddExpForm.set(!showAddExpForm())"
                class="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add Experience
              </button>
            </div>

            <!-- New Experience Form -->
            <div *ngIf="showAddExpForm()" class="bg-stone-50 p-5 rounded-xl border border-stone-200 mb-6 space-y-4">
              <h3 class="text-sm font-bold text-stone-800">New Experience Entry</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">Job Title *</label>
                  <input type="text" [(ngModel)]="newExp.jobTitle" placeholder="e.g. Senior Software Engineer" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">Company *</label>
                  <input type="text" [(ngModel)]="newExp.company" placeholder="e.g. Nimbus Labs" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-stone-700 mb-1">Location</label>
                <input type="text" [(ngModel)]="newExp.location" placeholder="e.g. Cape Town, South Africa" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">Start Date</label>
                  <input type="date" [(ngModel)]="newExp.startDate" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-stone-700 mb-1">End Date</label>
                  <input type="date" [(ngModel)]="newExp.endDate" class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea rows="2" [(ngModel)]="newExp.description" placeholder="Key responsibilities and achievements..." class="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-sm resize-y"></textarea>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button type="button" (click)="showAddExpForm.set(false)" class="px-4 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg">Cancel</button>
                <button type="button" (click)="addExperience()" class="px-4 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700">Add Entry</button>
              </div>
            </div>

            <!-- Experience List -->
            <div class="space-y-4">
              <div *ngFor="let exp of experiencesList(); let i = index" class="p-4 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/40 flex justify-between items-start transition-all">
                <div>
                  <h3 class="font-bold text-stone-900 text-sm">{{exp.jobTitle}}</h3>
                  <p class="text-xs text-stone-600 mt-0.5">{{exp.company}}<span *ngIf="exp.location"> • {{exp.location}}</span></p>
                  <p class="text-xs text-stone-400 mt-1" *ngIf="exp.startDate || exp.endDate">{{exp.startDate}}{{exp.startDate && exp.endDate ? ' – ' : ''}}{{exp.endDate}}</p>
                  <p class="text-xs text-stone-500 mt-1" *ngIf="exp.description">{{exp.description}}</p>
                </div>
                <button type="button" (click)="removeExperience(i)" class="text-stone-400 hover:text-red-600 p-1 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <p *ngIf="experiencesList().length === 0" class="text-sm text-stone-400">No work experience added yet.</p>
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
  private toast = inject(ToastService);

  profile = signal<any>(null);
  skillsList = signal<BackendSkill[]>([]);
  educationsList = signal<BackendEducation[]>([]);
  loading = signal(true);
  isSaving = false;
  justSaved = signal(false);

  resume = signal<{fileName: string; storedName: string} | null>(null);
  isUploadingResume = false;
  isDeletingResume = false;
  showResumePreview = signal(false);

  resumeFileName = () => {
    return this.resume()?.fileName || null;
  };

  resumeUrl = () => {
    const userId = this.auth.currentUser()?.userId;
    return userId ? this.jobSeekerService.getResumeUrl(userId) : '';
  };

  newSkillName = '';
  showAddEduForm = signal(false);
  newEdu: BackendEducation = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  };

  experiencesList = signal<BackendExperience[]>([]);
  showAddExpForm = signal(false);
  newExp: BackendExperience = {
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
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
      this.experiencesList.set(jobSeeker?.experiences ?? []);
      this.resume.set(jobSeeker?.resume ?? null);

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
    this.newEdu = { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' };
    this.showAddEduForm.set(false);
  }

  removeEducation(index: number) {
    const list = [...this.educationsList()];
    list.splice(index, 1);
    this.educationsList.set(list);
  }

  addExperience() {
    if (!this.newExp.jobTitle.trim() || !this.newExp.company.trim()) return;
    this.experiencesList.set([...this.experiencesList(), { ...this.newExp }]);
    this.newExp = { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' };
    this.showAddExpForm.set(false);
  }

  removeExperience(index: number) {
    const list = [...this.experiencesList()];
    list.splice(index, 1);
    this.experiencesList.set(list);
  }

  onResumeSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ['application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExts = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = allowedExts.some(ext => fileName.endsWith(ext));
    if (!hasValidExt || (!allowedTypes.includes(file.type) && file.type !== '')) {
      this.toast.error('Only PDF, DOC, or DOCX files are allowed.');
      input.value = '';
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      this.toast.error('File is too large. Maximum allowed size is 5 MB.');
      input.value = '';
      return;
    }

    const userId = this.auth.currentUser()?.userId;
    if (!userId) return;

    this.isUploadingResume = true;
    this.jobSeekerService.uploadResume(userId, file).subscribe({
      next: (res) => {
        this.isUploadingResume = false;
        input.value = '';
        if (res) {
          this.resume.set(res.resume ?? null);
          this.toast.success('Resume uploaded successfully.');
        } else {
          this.toast.error('Could not upload resume. Please try again.');
        }
      },
      error: (err) => {
        this.isUploadingResume = false;
        input.value = '';
        this.toast.error(err?.error?.message || 'Could not upload resume. Please try again.');
      }
    });
  }

  removeResume() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) return;

    this.isDeletingResume = true;
    this.jobSeekerService.deleteResume(userId).subscribe({
      next: () => {
        this.isDeletingResume = false;
        this.resume.set(null);
        this.toast.success('Resume removed.');
      },
      error: () => {
        this.isDeletingResume = false;
        this.toast.error('Could not remove resume. Please try again.');
      }
    });
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
      email: this.profileForm.value.email ?? '',
      phoneNumber: this.profileForm.value.phoneNumber ?? '',
      location: this.profileForm.value.location ?? '',
      headline: this.profileForm.value.headline ?? '',
      summary: this.profileForm.value.summary ?? '',
      skills: this.skillsList(),
      educations: this.educationsList(),
      experiences: this.experiencesList()
    };

    this.jobSeekerService.updateProfile(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res) {
          this.skillsList.set(res.skills ?? this.skillsList());
          this.educationsList.set(res.educations ?? this.educationsList());
          this.experiencesList.set(res.experiences ?? this.experiencesList());
        }
        this.auth.refreshUser({
          name: `${payload.firstName} ${payload.lastName}`.trim(),
          email: payload.email,
          location: payload.location,
          currentTitle: payload.headline
        });
        this.justSaved.set(true);
        setTimeout(() => this.justSaved.set(false), 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.toast.error(err?.error?.message || 'Failed to save changes. Please try again.');
      }
    });
  }
}
