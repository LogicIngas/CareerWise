import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-4xl mx-auto pb-24">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-2xl font-bold text-stone-900">Post a Job</h1>
        <p class="text-stone-500 mt-1">Create a new listing to find great talent</p>
      </div>

      <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <!-- Job Details Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h2 class="text-lg font-bold text-stone-900 mb-6">Job details</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Job title</label>
              <input type="text" formControlName="title" placeholder="e.g. Senior Frontend Engineer"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 placeholder-stone-400">
              <p *ngIf="jobForm.get('title')?.touched && jobForm.get('title')?.invalid" class="text-xs text-red-600 mt-1.5">Job title is required.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Company</label>
                <input type="text" formControlName="company" placeholder="Company name"
                  class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 placeholder-stone-400">
                <p *ngIf="jobForm.get('company')?.touched && jobForm.get('company')?.invalid" class="text-xs text-red-600 mt-1.5">Company is required.</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Location</label>
                <input type="text" formControlName="location" placeholder="City, State or Remote"
                  class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 placeholder-stone-400">
                <p *ngIf="jobForm.get('location')?.touched && jobForm.get('location')?.invalid" class="text-xs text-red-600 mt-1.5">Location is required.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Job type</label>
                <div class="relative">
                  <select formControlName="type" class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 appearance-none bg-white">
                    <option value="" disabled selected>Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                  <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                <p *ngIf="jobForm.get('type')?.touched && jobForm.get('type')?.invalid" class="text-xs text-red-600 mt-1.5">Select a job type.</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-stone-700 mb-2">Salary range</label>
                <input type="text" formControlName="salaryRange" placeholder="e.g. $120k - $150k"
                  class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 placeholder-stone-400">
              </div>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h2 class="text-lg font-bold text-stone-900 mb-6">Description</h2>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Job description</label>
              <textarea formControlName="description" rows="5" placeholder="Describe the role..."
                class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 placeholder-stone-400 resize-y"></textarea>
              <p *ngIf="jobForm.get('description')?.touched && jobForm.get('description')?.invalid" class="text-xs text-red-600 mt-1.5">A job description is required.</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Requirements</label>
              <textarea formControlName="requirements" rows="4" placeholder="List the requirements..." 
                class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 placeholder-stone-400 resize-y"></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Skills (comma separated)</label>
              <input type="text" formControlName="skills" placeholder="React, TypeScript, Tailwind" 
                class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 placeholder-stone-400">
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-4 pt-4">
          <span *ngIf="justPublished()" class="text-sm font-medium text-brand-700 flex items-center gap-1.5 mr-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            Job published
          </span>
          <button type="button" class="px-6 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all">
            Save draft
          </button>
          <button type="submit" [disabled]="isSubmitting" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-400 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
            <span *ngIf="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Publish job
          </button>
        </div>

      </form>
    </div>
  `
})
export class PostJobComponent {
  private fb = inject(FormBuilder);

  isSubmitting = false;
  justPublished = signal(false);

  jobForm = this.fb.group({
    title: ['', Validators.required],
    company: ['', Validators.required],
    location: ['', Validators.required],
    type: ['', Validators.required],
    salaryRange: [''],
    description: ['', Validators.required],
    requirements: [''],
    skills: ['']
  });

  onSubmit() {
    if (this.jobForm.valid) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.jobForm.reset();
        this.justPublished.set(true);
        setTimeout(() => this.justPublished.set(false), 3000);
      }, 1000);
    } else {
      this.jobForm.markAllAsTouched();
    }
  }
}
