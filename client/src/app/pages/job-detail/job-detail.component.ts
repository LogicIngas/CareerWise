import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { JobService, BackendJob } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { SavedJobService } from '../../services/saved-job.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Job } from '../../models/models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-stone-50/50 min-h-screen pb-20">
      <div class="max-w-4xl mx-auto px-6 md:px-12 py-10">
        <a routerLink="/jobs" class="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-700 transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to jobs
        </a>

        <div *ngIf="job() as j" class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div class="flex gap-4">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-2xl {{j.companyColor}} shadow-sm flex-shrink-0">
                  {{j.companyInitial}}
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-stone-900">{{j.title}}</h1>
                  <p class="text-stone-500 mt-0.5">{{j.company}}</p>
                </div>
              </div>
              <button
                type="button"
                (click)="onToggleSave()"
                [attr.aria-label]="isSaved() ? 'Unsave job' : 'Save job'"
                class="p-2.5 rounded-lg transition-all active:scale-90 flex-shrink-0"
                [ngClass]="isSaved() ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-stone-400 hover:text-brand-600 hover:bg-stone-50 border border-stone-200'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" [attr.fill]="isSaved() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
            </div>

            <div class="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-6 border-t border-stone-100 text-sm text-stone-600">
              <div class="flex items-center gap-2">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {{j.location}}
              </div>
              <div class="flex items-center gap-2">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                {{j.salaryRange}}
              </div>
              <div class="flex items-center gap-2">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{j.postedTime}}
              </div>
              <span *ngIf="j.isRemote" class="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full self-center">Remote</span>
            </div>

            <div *ngIf="rawJob()?.deadlineDate" class="mt-4 inline-flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              Applications close {{ rawJob()!.deadlineDate }}
            </div>

            <div class="mt-6 flex items-center gap-4 pt-2">
              <button
                *ngIf="!hasApplied()"
                type="button"
                (click)="onApply()"
                [disabled]="applying()"
                class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-50 text-white font-medium py-2.5 px-6 rounded-lg transition-all text-sm shadow-sm flex items-center justify-center gap-1.5">
                <svg *ngIf="applying()" class="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                {{ applying() ? 'Applying...' : 'Apply Now' }}
              </button>
              <span *ngIf="hasApplied()" class="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium py-2.5 px-6 rounded-lg text-sm flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Applied
              </span>
              <span class="text-sm font-semibold text-stone-900">{{j.type}}</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8" *ngIf="rawJob()?.description">
            <h2 class="text-lg font-bold text-stone-900 mb-3">About this role</h2>
            <p class="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{{ rawJob()!.description }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8" *ngIf="(rawJob()?.requirements?.length ?? 0) > 0">
            <h2 class="text-lg font-bold text-stone-900 mb-4">Requirements</h2>
            <ul class="space-y-2.5">
              <li *ngFor="let r of rawJob()!.requirements" class="flex items-start gap-2.5 text-sm text-stone-600">
                <svg class="text-brand-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{{r}}</span>
              </li>
            </ul>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8" *ngIf="(rawJob()?.responsibilities?.length ?? 0) > 0">
            <h2 class="text-lg font-bold text-stone-900 mb-4">Responsibilities</h2>
            <ul class="space-y-2.5">
              <li *ngFor="let r of rawJob()!.responsibilities" class="flex items-start gap-2.5 text-sm text-stone-600">
                <span class="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2 flex-shrink-0"></span>
                <span>{{r}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div *ngIf="loading()" class="py-16 text-center text-stone-500 animate-pulse">
          Loading job...
        </div>

        <div *ngIf="!loading() && !job()" class="py-16 text-center">
          <p class="text-stone-900 font-semibold mb-1">Job not found</p>
          <a routerLink="/jobs" class="text-sm text-brand-600 hover:underline">Browse open positions</a>
        </div>
      </div>
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private savedJobService = inject(SavedJobService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  job = signal<Job | null>(null);
  rawJob = signal<BackendJob | null>(null);
  loading = signal(true);
  applying = signal(false);

  isSaved = computed(() => {
    const j = this.job();
    return j ? this.savedJobService.isSaved(j.id) : false;
  });

  hasApplied = computed(() => {
    const j = this.job();
    return j ? this.applicationService.hasApplied(j.id) : false;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }

    forkJoin({
      job: this.jobService.getById(id),
      raw: this.jobService.getRawById(id)
    }).subscribe(({ job, raw }) => {
      this.job.set(job);
      this.rawJob.set(raw);
      this.loading.set(false);
    });
  }

  onApply() {
    const user = this.auth.currentUser();
    const job = this.job();
    if (!job) return;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (user.role !== 'candidate') {
      this.toast.info('Employers cannot apply to jobs.');
      return;
    }

    this.applying.set(true);
    this.applicationService.apply(job.id).subscribe({
      next: (app) => {
        this.applying.set(false);
        if (app) {
          this.toast.success('Application submitted successfully.');
        } else {
          this.toast.error('Unable to submit application.');
        }
      },
      error: () => {
        this.applying.set(false);
        this.toast.error('Failed to apply. Please try again.');
      }
    });
  }

  onToggleSave() {
    const user = this.auth.currentUser();
    const job = this.job();
    if (!job) return;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (user.role !== 'candidate') {
      this.toast.info('Log in as a candidate to save jobs.');
      return;
    }

    const wasSaved = this.isSaved();
    this.savedJobService.toggleSave(job).subscribe(success => {
      if (success) {
        this.toast.success(!wasSaved ? 'Job saved to your list.' : 'Job removed from your saved list.');
      }
    });
  }
}
