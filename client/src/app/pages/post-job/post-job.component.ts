import { Component, inject } from '@angular/core';
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
        <h1 class="text-2xl font-bold text-gray-900">Post a Job</h1>
        <p class="text-gray-500 mt-1">Create a new listing to find great talent</p>
      </div>

      <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <!-- Job Details Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Job details</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Job title</label>
              <input type="text" formControlName="title" placeholder="e.g. Senior Frontend Engineer" 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                <input type="text" formControlName="company" placeholder="Company name" 
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400">
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input type="text" formControlName="location" placeholder="City, State or Remote" 
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Job type</label>
                <div class="relative">
                  <select formControlName="type" class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 appearance-none bg-white">
                    <option value="" disabled selected>Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                  <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Salary range</label>
                <input type="text" formControlName="salaryRange" placeholder="e.g. $120k - $150k" 
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400">
              </div>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Description</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Job description</label>
              <textarea formControlName="description" rows="5" placeholder="Describe the role..." 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400 resize-y"></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
              <textarea formControlName="requirements" rows="4" placeholder="List the requirements..." 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400 resize-y"></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Skills (comma separated)</label>
              <input type="text" formControlName="skills" placeholder="React, TypeScript, Tailwind" 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400">
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-4 pt-4">
          <button type="button" class="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            Save draft
          </button>
          <button type="submit" [disabled]="isSubmitting" class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
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
      console.log('Publishing Job...', this.jobForm.value);
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Job Published (Mock)');
        this.jobForm.reset();
      }, 1000);
    } else {
      this.jobForm.markAllAsTouched();
    }
  }
}
