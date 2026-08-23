import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { SavedJobService } from '../../services/saved-job.service';
import { AuthService } from '../../services/auth.service';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { Application } from '../../models/models';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-stone-900">Jobseeker Hub</h1>
          <p class="text-stone-500 mt-1">Track your active applications and saved opportunities</p>
        </div>

        <a routerLink="/jobs" class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white text-sm font-medium rounded-xl transition-all shadow-sm self-start md:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          Find More Jobs
        </a>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Total Applied</span>
            <span class="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
            </span>
          </div>
          <div class="text-2xl font-extrabold text-stone-900">{{ applications().length }}</div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Interviews</span>
            <span class="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </span>
          </div>
          <div class="text-2xl font-extrabold text-brand-600">{{ countStatus('Interview') }}</div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Under Review</span>
            <span class="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
          </div>
          <div class="text-2xl font-extrabold text-purple-600">{{ countStatus('Under Review') }}</div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-stone-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Saved Jobs</span>
            <span class="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </span>
          </div>
          <div class="text-2xl font-extrabold text-amber-600">{{ savedJobs().length }}</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-stone-200 mb-6 gap-8">
        <button
          type="button"
          (click)="activeTab.set('applied')"
          class="pb-3 text-sm font-semibold transition-all relative"
          [ngClass]="activeTab() === 'applied' ? 'text-brand-700 border-b-2 border-brand-600' : 'text-stone-500 hover:text-stone-900'">
          Applied Jobs ({{ applications().length }})
        </button>

        <button
          type="button"
          (click)="activeTab.set('saved')"
          class="pb-3 text-sm font-semibold transition-all relative flex items-center gap-1.5"
          [ngClass]="activeTab() === 'saved' ? 'text-brand-700 border-b-2 border-brand-600' : 'text-stone-500 hover:text-stone-900'">
          Saved Jobs ({{ savedJobs().length }})
          <span *ngIf="savedJobs().length > 0" class="w-2 h-2 rounded-full bg-amber-500"></span>
        </button>
      </div>

      <!-- Tab 1: Applied Jobs -->
      <div *ngIf="activeTab() === 'applied'">
        <!-- Filter pills -->
        <div class="flex items-center gap-2 mb-4 flex-wrap" *ngIf="applications().length > 0">
          <span class="text-xs font-medium text-stone-400 mr-1">Filter:</span>
          <button
            type="button"
            *ngFor="let s of statusFilters"
            (click)="selectedStatusFilter.set(s)"
            class="px-3 py-1 text-xs font-medium rounded-lg transition-all"
            [ngClass]="selectedStatusFilter() === s ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'">
            {{ s }}
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-stone-200 bg-stone-50/60 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <th class="py-4 px-6 font-medium">Position & Company</th>
                <th class="py-4 px-6 font-medium hidden sm:table-cell">Location / Salary</th>
                <th class="py-4 px-6 font-medium">Date Applied</th>
                <th class="py-4 px-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 text-sm">
              <tr *ngFor="let app of filteredApplications()" class="hover:bg-stone-50/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="font-bold text-stone-900">{{ app.jobTitle }}</div>
                  <div class="text-stone-500 text-xs mt-0.5">{{ app.company }}</div>
                </td>
                <td class="py-4 px-6 hidden sm:table-cell">
                  <div class="text-stone-700 text-xs">{{ app.location || 'Remote / Hybrid' }}</div>
                  <div class="text-stone-500 text-xs">{{ app.salaryRange || 'Competitive' }}</div>
                </td>
                <td class="py-4 px-6 text-stone-600 text-xs">
                  {{ app.dateApplied }}
                </td>
                <td class="py-4 px-6">
                  <span class="px-3 py-1 text-xs font-bold rounded-md border inline-flex items-center gap-1.5"
                    [ngClass]="{
                      'bg-brand-50 text-brand-700 border-brand-200': app.status === 'Interview' || app.status === 'Offer',
                      'bg-purple-50 text-purple-700 border-purple-200': app.status === 'Under Review',
                      'bg-stone-100 text-stone-700 border-stone-200': app.status === 'Applied',
                      'bg-red-50 text-red-700 border-red-200': app.status === 'Rejected'
                    }">
                    <span class="w-1.5 h-1.5 rounded-full"
                      [ngClass]="{
                        'bg-brand-600': app.status === 'Interview' || app.status === 'Offer',
                        'bg-purple-600': app.status === 'Under Review',
                        'bg-stone-400': app.status === 'Applied',
                        'bg-red-600': app.status === 'Rejected'
                      }"></span>
                    {{ app.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="loadingApps()" class="p-12 text-center text-stone-500 animate-pulse">
            Loading your applications...
          </div>

          <div *ngIf="!loadingApps() && applications().length === 0" class="p-16 text-center">
            <div class="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 class="text-stone-900 font-bold mb-1">No applications yet</h3>
            <p class="text-stone-500 text-sm max-w-sm mx-auto mb-6">
              When you apply to jobs, track interview stages, recruiter feedback, and offers right here.
            </p>
            <a routerLink="/jobs" class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white text-sm font-medium rounded-xl transition-all shadow-sm">
              Explore Open Roles
            </a>
          </div>
        </div>
      </div>

      <!-- Tab 2: Saved Jobs -->
      <div *ngIf="activeTab() === 'saved'">
        <div *ngIf="loadingSaved()" class="text-center text-stone-500 py-16 animate-pulse">
          Loading saved jobs...
        </div>

        <div *ngIf="!loadingSaved() && savedJobs().length === 0" class="text-center py-20 bg-white border border-dashed border-stone-200 rounded-3xl p-8">
          <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-stone-900 mb-1">No saved jobs</h3>
          <p class="text-stone-500 text-sm max-w-md mx-auto mb-6">
            Click the pin icon on any job card to save it for quick access here.
          </p>
          <a routerLink="/jobs" class="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-all">
            Browse jobs
          </a>
        </div>

        <div *ngIf="!loadingSaved() && savedJobs().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-job-card *ngFor="let job of savedJobs()" [job]="job"></app-job-card>
        </div>
      </div>

    </div>
  `
})
export class ApplicationsComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private savedJobService = inject(SavedJobService);
  private auth = inject(AuthService);

  activeTab = signal<'applied' | 'saved'>('applied');
  selectedStatusFilter = signal<string>('All');
  statusFilters = ['All', 'Interview', 'Under Review', 'Applied', 'Offer', 'Rejected'];

  applications = this.applicationService.applications;
  loadingApps = this.applicationService.loading;

  savedJobs = this.savedJobService.savedJobs;
  loadingSaved = this.savedJobService.loading;

  filteredApplications = computed(() => {
    const list = this.applications();
    const filter = this.selectedStatusFilter();
    if (filter === 'All') return list;
    return list.filter(a => a.status.toLowerCase() === filter.toLowerCase());
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      this.applicationService.getApplicationsByJobSeeker(user.userId).subscribe();
      this.savedJobService.loadSavedJobs(user.userId).subscribe();
    }
  }

  countStatus(status: string): number {
    return this.applications().filter(a => a.status.toLowerCase() === status.toLowerCase()).length;
  }
}
