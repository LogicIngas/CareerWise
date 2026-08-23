import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { SavedJobService } from '../../services/saved-job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <span>Saved Jobs</span>
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {{ savedJobs().length }}
            </span>
          </h1>
          <p class="text-stone-500 mt-1">Jobs you've pinned to review or apply to later</p>
        </div>

        <a routerLink="/jobs" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-all self-start md:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          Explore More Jobs
        </a>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="text-center text-stone-500 py-16 animate-pulse">
        <div class="inline-block p-3 rounded-full bg-brand-50 text-brand-600 mb-3">
          <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <p class="font-medium text-stone-700">Loading saved jobs...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && savedJobs().length === 0" class="text-center py-20 bg-white border border-dashed border-stone-200 rounded-3xl p-8">
        <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-stone-900 mb-1">No saved jobs yet</h3>
        <p class="text-stone-500 text-sm max-w-md mx-auto mb-6">
          Pin roles you're interested in while browsing, and they'll be saved here so you can easily track and apply to them.
        </p>
        <a routerLink="/jobs" class="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white text-sm font-medium rounded-xl transition-all shadow-sm">
          Browse open positions
        </a>
      </div>

      <!-- Jobs Grid -->
      <div *ngIf="!loading() && savedJobs().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-job-card *ngFor="let job of savedJobs()" [job]="job"></app-job-card>
      </div>
    </div>
  `
})
export class SavedJobsComponent implements OnInit {
  private savedJobService = inject(SavedJobService);
  private auth = inject(AuthService);

  savedJobs = this.savedJobService.savedJobs;
  loading = this.savedJobService.loading;

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      this.savedJobService.loadSavedJobs(user.userId).subscribe();
    }
  }
}
