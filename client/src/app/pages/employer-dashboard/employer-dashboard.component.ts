import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployerService, BackendEmployerFull } from '../../services/employer.service';
import { JobService, BackendJob } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { EmployerStat, EmployerPosting } from '../../models/models';

function mapJobStatus(status: BackendJob['status']): EmployerPosting['status'] {
  return status === 'OPEN' ? 'Active' : 'Closed';
}

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-stone-900">{{ companyName() ? companyName() + ' · Hiring' : 'Employer Dashboard' }}</h1>
          <p class="text-stone-500 mt-1">Overview of your hiring pipeline</p>
        </div>
        <button routerLink="/post-job" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Post Job
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div *ngFor="let stat of stats()" class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-32">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
               [ngClass]="{
                 'bg-blue-50 text-blue-600': stat.icon === 'briefcase',
                 'bg-purple-50 text-purple-600': stat.icon === 'users',
                 'bg-brand-50 text-brand-600': stat.icon === 'eye',
                 'bg-pink-50 text-pink-600': stat.icon === 'file'
               }">
            <ng-container [ngSwitch]="stat.icon">
              <svg *ngSwitchCase="'briefcase'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <svg *ngSwitchCase="'users'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <svg *ngSwitchCase="'eye'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg *ngSwitchCase="'file'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
            </ng-container>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-stone-900">{{stat.value}}</div>
            <div class="text-sm text-stone-500 font-medium">{{stat.label}}</div>
          </div>
        </div>
        <div *ngIf="loadingStats()" class="col-span-full py-8 text-center text-stone-500 animate-pulse">
          Loading statistics...
        </div>
      </div>

      <!-- Edit Job Form -->
      <div *ngIf="editingJob()" class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-stone-900">Edit Job</h2>
          <button (click)="cancelEdit()" class="text-stone-400 hover:text-stone-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form [formGroup]="editForm" (ngSubmit)="onSaveEdit()" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Job title</label>
              <input type="text" formControlName="title" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
            </div>
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Location</label>
              <input type="text" formControlName="location" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Salary range</label>
              <input type="text" formControlName="salaryRange" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
            </div>
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Job type</label>
              <div class="relative">
                <select formControlName="employmentType" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 text-sm appearance-none bg-white">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-stone-700 mb-2">Description</label>
            <textarea formControlName="description" rows="4" class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm resize-y"></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-stone-700 mb-2">Requirements (comma separated)</label>
            <input type="text" formControlName="requirements" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm">
          </div>

          <div>
            <label class="block text-sm font-semibold text-stone-700 mb-2">Status</label>
            <div class="relative">
              <select formControlName="status" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-stone-900 text-sm appearance-none bg-white">
                <option value="OPEN">Active</option>
                <option value="CLOSED">Closed</option>
              </select>
              <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button type="submit" [disabled]="isSavingEdit" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2">
              <span *ngIf="isSavingEdit" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Save changes
            </button>
            <button type="button" (click)="cancelEdit()" class="px-6 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all">
              Cancel
            </button>
            <span *ngIf="editSuccess()" class="text-sm font-medium text-brand-700 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
              Saved
            </span>
            <span *ngIf="editError()" class="text-sm font-medium text-red-600">{{ editError() }}</span>
          </div>
        </form>
      </div>

      <!-- Job Postings -->
      <div class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div class="p-6 border-b border-stone-100">
          <h2 class="text-lg font-bold text-stone-900">Your job postings</h2>
        </div>

        <div class="divide-y divide-stone-50">
          <div *ngFor="let post of postings()" class="p-6 flex justify-between items-center hover:bg-stone-50/50 transition-colors">
            <div class="min-w-0 flex-1">
              <h3 class="font-bold text-stone-900 mb-1">{{post.title}}</h3>
              <p class="text-sm text-stone-500">{{post.applicantsCount}} applicants</p>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <button (click)="startEdit(post.id)" class="p-2 text-stone-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </button>
              <button (click)="deleteJob(post.id)" class="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
              <span class="px-3 py-1.5 text-xs font-bold rounded-md"
                [ngClass]="{
                  'bg-brand-600 text-white': post.status === 'Active',
                  'bg-stone-100 text-stone-600': post.status === 'Paused',
                  'bg-red-50 text-red-700 border border-red-100': post.status === 'Closed'
                }">
                {{post.status}}
              </span>
            </div>
          </div>
          <div *ngIf="loadingPostings()" class="p-8 text-center text-stone-500 animate-pulse">
            Loading postings...
          </div>
          <div *ngIf="!loadingPostings() && postings().length === 0" class="p-12 text-center">
            <p class="text-stone-900 font-semibold mb-1">No job postings yet</p>
            <p class="text-stone-500 text-sm">Post your first role to start receiving applicants.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployerDashboardComponent implements OnInit {
  private employerService = inject(EmployerService);
  private jobService = inject(JobService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  stats = signal<EmployerStat[]>([]);
  postings = signal<EmployerPosting[]>([]);

  loadingStats = signal(true);
  loadingPostings = signal(true);

  companyName = () => this.auth.currentUser()?.companyName ?? null;

  editingJob = signal<BackendJob | null>(null);
  isSavingEdit = false;
  editSuccess = signal(false);
  editError = signal<string | null>(null);

  editForm = this.fb.group({
    title: ['', Validators.required],
    location: ['', Validators.required],
    salaryRange: [''],
    employmentType: ['Full-time'],
    description: ['', Validators.required],
    requirements: [''],
    status: ['OPEN']
  });

  private allJobs: BackendJob[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) {
      this.loadingStats.set(false);
      this.loadingPostings.set(false);
      return;
    }

    this.employerService.getById(userId).subscribe((employer: BackendEmployerFull | null) => {
      const jobs = employer?.postedJobs ?? [];
      this.allJobs = jobs;

      this.stats.set([
        { label: 'Active Jobs', value: jobs.filter(j => j.status === 'OPEN').length, icon: 'briefcase' },
        { label: 'Total Applicants', value: 0, icon: 'users' },
        { label: 'Job Views', value: 0, icon: 'eye' },
        { label: 'New Today', value: 0, icon: 'file' }
      ]);
      this.loadingStats.set(false);

      this.postings.set(jobs.map(j => ({
        id: j.jobId!,
        title: j.title,
        applicantsCount: 0,
        status: mapJobStatus(j.status)
      })));
      this.loadingPostings.set(false);
    });
  }

  startEdit(jobId: string) {
    const job = this.allJobs.find(j => j.jobId === jobId);
    if (!job) return;
    this.editingJob.set(job);
    this.editSuccess.set(false);
    this.editError.set(null);
    this.editForm.patchValue({
      title: job.title,
      location: job.location,
      salaryRange: job.salaryRange,
      employmentType: job.employmentType,
      description: job.description,
      requirements: (job.requirements ?? []).join(', '),
      status: job.status
    });
  }

  cancelEdit() {
    this.editingJob.set(null);
    this.editSuccess.set(false);
    this.editError.set(null);
  }

  onSaveEdit() {
    const current = this.editingJob();
    if (!this.editForm.valid || !current) return;
    this.isSavingEdit = true;
    this.editError.set(null);

    const v = this.editForm.value;
    const requirements = (v.requirements ?? '')
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const updated: BackendJob = {
      ...current,
      title: v.title!,
      location: v.location!,
      salaryRange: v.salaryRange || '',
      employmentType: v.employmentType!,
      description: v.description!,
      requirements,
      status: v.status as BackendJob['status']
    };

    this.jobService.update(updated).subscribe({
      next: (result: BackendJob | null) => {
        this.isSavingEdit = false;
        if (!result) {
          this.editError.set('Could not save changes. Please try again.');
          return;
        }
        this.editSuccess.set(true);
        setTimeout(() => this.editSuccess.set(false), 3000);
        this.loadData();
        this.editingJob.set(null);
      },
      error: () => {
        this.isSavingEdit = false;
        this.editError.set('Could not save changes. Please try again.');
      }
    });
  }

  deleteJob(jobId: string) {
    if (!confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;

    this.jobService.delete(jobId).subscribe({
      next: () => this.loadData(),
      error: () => alert('Could not delete the job. Please try again.')
    });
  }
}
