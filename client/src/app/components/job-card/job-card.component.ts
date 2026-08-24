import { Component, Input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Job } from '../../models/models';
import { SavedJobService } from '../../services/saved-job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      (click)="goToDetail()"
      class="bg-white rounded-xl p-6 border border-stone-200 hover:border-stone-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(26,53,46,0.18)] transition-all duration-200 h-full flex flex-col relative group cursor-pointer">
      <div class="flex justify-between items-start mb-4">
        <div class="flex gap-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl {{job.companyColor}} shadow-sm">
            {{job.companyInitial}}
          </div>
          <div>
            <h3 class="font-bold text-stone-900 text-lg group-hover:text-brand-700 transition-colors">{{job.title}}</h3>
            <p class="text-stone-500 text-sm">{{job.company}}</p>
          </div>
        </div>

        <!-- Pin / Bookmark Action Button -->
        <button
          type="button"
          (click)="onTogglePin($event)"
          [attr.aria-label]="isSaved() ? 'Unsave job' : 'Save job'"
          [title]="isSaved() ? 'Saved (Click to unsave)' : 'Save job for later'"
          class="p-2 rounded-lg transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          [ngClass]="isSaved() ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-stone-400 hover:text-brand-600 hover:bg-stone-50'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            [attr.fill]="isSaved() ? 'currentColor' : 'none'"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="transition-transform duration-200"
            [ngClass]="{'scale-110': isSaved()}">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </button>
      </div>

      <div class="flex flex-wrap gap-1.5 mb-6">
        <span *ngFor="let tag of job.tags" class="px-2.5 py-1 bg-stone-50 border border-stone-200/80 text-stone-600 text-xs font-medium rounded-md">
          {{tag}}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-y-3 mb-6 flex-grow">
        <div class="flex items-center gap-2 text-stone-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="truncate">{{job.location}}</span>
        </div>
        <div class="flex items-center gap-2 text-stone-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <span class="truncate">{{job.salaryRange}}</span>
        </div>
        <div class="flex items-center gap-2 text-stone-500 text-sm col-span-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>{{job.postedTime}}</span>
          <span *ngIf="job.isRemote" class="ml-2 px-2 py-0.5 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full">Remote</span>
        </div>
      </div>

      <div class="flex items-center justify-between mt-auto pt-2 border-t border-stone-100">
        <button
          *ngIf="!hasApplied()"
          type="button"
          (click)="onApply($event)"
          [disabled]="applying()"
          class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-50 text-white font-medium py-2 px-5 rounded-lg transition-all text-sm flex-1 mr-4 shadow-sm flex items-center justify-center gap-1.5">
          <svg *ngIf="applying()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          {{ applying() ? 'Applying...' : 'Apply Now' }}
        </button>

        <button
          *ngIf="hasApplied()"
          type="button"
          (click)="viewApplication($event)"
          class="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium py-2 px-5 rounded-lg transition-all text-sm flex-1 mr-4 flex items-center justify-center gap-1.5 hover:bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Applied
        </button>

        <span class="text-sm font-semibold text-stone-900 whitespace-nowrap">
          {{job.type}}
        </span>
      </div>
    </div>
  `
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;

  private savedJobService = inject(SavedJobService);
  private applicationService = inject(ApplicationService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  applying = signal(false);

  isSaved = computed(() => {
    return this.savedJobService.isSaved(this.job?.id);
  });

  hasApplied = computed(() => {
    return this.applicationService.hasApplied(this.job?.id);
  });

  onTogglePin(event: MouseEvent) {
    event.stopPropagation();
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.role !== 'candidate') {
      this.toast.info('Log in as a candidate to save jobs.');
      return;
    }

    const wasSaved = this.isSaved();
    this.savedJobService.toggleSave(this.job).subscribe(success => {
      if (success) {
        this.toast.success(!wasSaved ? 'Job saved to your list.' : 'Job removed from your saved list.');
      }
    });
  }

  onApply(event: MouseEvent) {
    event.stopPropagation();
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.role !== 'candidate') {
      this.toast.info('Employers cannot apply to jobs.');
      return;
    }

    this.applying.set(true);
    this.applicationService.apply(this.job.id, 'Applied via 1-click apply').subscribe({
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

  viewApplication(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/applications']);
  }

  goToDetail() {
    this.router.navigate(['/jobs', this.job.id]);
  }
}
