import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { SavedJobService } from '../../services/saved-job.service';
import { AuthService } from '../../services/auth.service';
import { JobSeekerService, BackendJobSeekerFull } from '../../services/job-seeker.service';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { Job } from '../../models/models';

const PROFILE_STRENGTH_CHECKS: Array<(js: BackendJobSeekerFull) => boolean> = [
  js => !!js.headline,
  js => !!js.summary,
  js => !!js.phoneNumber,
  js => !!js.location,
  js => !!js.resume,
  js => (js.skills?.length ?? 0) > 0,
  js => (js.educations?.length ?? 0) > 0
];

function computeProfileStrength(js: BackendJobSeekerFull | null): number {
  if (!js) return 0;
  const filled = PROFILE_STRENGTH_CHECKS.filter(check => check(js)).length;
  return Math.round((filled / PROFILE_STRENGTH_CHECKS.length) * 100);
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-stone-900 flex items-center gap-2">
            Welcome back, {{ firstName() }} <span class="text-2xl">👋</span>
          </h1>
          <p class="text-stone-500 mt-1">Here's what's happening with your job search</p>
        </div>
        <a routerLink="/jobs" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          Find Jobs
        </a>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-32 hover:border-stone-200 transition-all">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-stone-900">{{ applications().length }}</div>
            <div class="text-sm text-stone-500 font-medium">Applications</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-32 hover:border-stone-200 transition-all">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-stone-900">{{ savedJobs().length }}</div>
            <div class="text-sm text-stone-500 font-medium">Saved Jobs</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-32 hover:border-stone-200 transition-all">
          <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-stone-900">{{ profileViews() }}</div>
            <div class="text-sm text-stone-500 font-medium">Profile Views</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-32 hover:border-stone-200 transition-all">
          <div class="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-stone-900">{{ interviewCount() }}</div>
            <div class="text-sm text-stone-500 font-medium">Interviews</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content Left -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Recent Applications -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-stone-900">Recent applications</h2>
              <a routerLink="/applications" class="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </a>
            </div>

            <div class="space-y-4">
              <div *ngFor="let app of recentApplications()" class="flex items-center justify-between py-3 border-b border-stone-50 last:border-0 last:pb-0">
                <div>
                  <h3 class="font-bold text-stone-900 text-sm">{{app.jobTitle}}</h3>
                  <p class="text-stone-500 text-xs">{{app.company}} • {{app.dateApplied}}</p>
                </div>
                <span class="px-3 py-1 text-xs font-semibold rounded-md border"
                  [ngClass]="{
                    'bg-brand-50 text-brand-700 border-brand-200': app.status === 'Interview' || app.status === 'Offer',
                    'bg-purple-50 text-purple-700 border-purple-200': app.status === 'Under Review',
                    'bg-stone-100 text-stone-700 border-stone-200': app.status === 'Applied',
                    'bg-red-50 text-red-700 border-red-200': app.status === 'Rejected'
                  }">
                  {{app.status}}
                </span>
              </div>

              <div *ngIf="loadingApps()" class="text-center text-sm text-stone-500 py-4 animate-pulse">
                Loading applications...
              </div>

              <div *ngIf="!loadingApps() && applications().length === 0" class="text-center py-8">
                <p class="text-sm text-stone-500">No applications yet — apply to jobs to track your progress here.</p>
                <a routerLink="/jobs" class="text-xs font-semibold text-brand-600 hover:underline mt-2 inline-block">Browse open positions</a>
              </div>
            </div>
          </div>

          <!-- Recommended for you -->
          <div>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-stone-900">Recommended for you</h2>
              <a routerLink="/jobs" class="text-sm font-medium text-brand-600 hover:text-brand-700">Explore all</a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-job-card *ngFor="let job of recommendedJobs()" [job]="job"></app-job-card>
            </div>

            <div *ngIf="loadingJobs()" class="text-center text-sm text-stone-500 py-8 animate-pulse">
              Loading recommended jobs...
            </div>
          </div>
        </div>

        <!-- Sidebar Right -->
        <div>
          <!-- Profile Strength -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-8">
            <h2 class="text-lg font-bold text-stone-900 mb-6">Profile strength</h2>
            
            <div class="flex items-end gap-2 mb-4">
              <span class="text-3xl font-extrabold text-brand-600 leading-none">{{ profileStrength() }}%</span>
              <span class="text-stone-500 text-sm font-medium pb-1">complete</span>
            </div>

            <div class="w-full bg-brand-50 rounded-full h-2.5 mb-6 overflow-hidden">
              <div class="bg-brand-600 h-2.5 rounded-full transition-all duration-300" [style.width.%]="profileStrength()"></div>
            </div>

            <p class="text-sm text-stone-600 mb-6">
              Keep your profile up-to-date to improve recruiter match accuracy.
            </p>

            <a routerLink="/profile" class="block text-center w-full py-2.5 px-4 border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all">
              Update profile
            </a>
          </div>

          <!-- Quick Navigation -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 class="text-sm font-bold text-stone-900 mb-4">Quick Links</h3>
            <div class="space-y-2">
              <a routerLink="/saved-jobs" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 text-sm font-medium transition-all group">
                <span class="flex items-center gap-2.5">
                  <svg class="text-amber-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                  Saved Jobs
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 group-hover:bg-brand-50 group-hover:text-brand-700">
                  {{ savedJobs().length }}
                </span>
              </a>
              <a routerLink="/applications" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 text-sm font-medium transition-all group">
                <span class="flex items-center gap-2.5">
                  <svg class="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
                  My Applications
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 group-hover:bg-brand-50 group-hover:text-brand-700">
                  {{ applications().length }}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private savedJobService = inject(SavedJobService);
  private jobSeekerService = inject(JobSeekerService);
  private auth = inject(AuthService);

  applications = this.applicationService.applications;
  savedJobs = this.savedJobService.savedJobs;
  loadingApps = this.applicationService.loading;

  recommendedJobs = signal<Job[]>([]);
  loadingJobs = signal(true);
  profileStrength = signal(0);
  profileViews = signal(0);

  firstName = () => this.auth.currentUser()?.name?.split(' ')[0] ?? 'there';

  recentApplications = computed(() => {
    return this.applications().slice(0, 4);
  });

  interviewCount = computed(() => {
    return this.applications().filter(a => a.status.toLowerCase() === 'interview').length;
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      this.applicationService.getApplicationsByJobSeeker(user.userId).subscribe();
      this.savedJobService.loadSavedJobs(user.userId).subscribe();
      this.jobSeekerService.getById(user.userId).subscribe(jobSeeker => {
        this.profileStrength.set(computeProfileStrength(jobSeeker));
        this.profileViews.set(jobSeeker?.profileViews ?? 0);
      });
    }

    this.jobService.getOpenPositions().subscribe(data => {
      this.recommendedJobs.set(data.slice(0, 2));
      this.loadingJobs.set(false);
    });
  }
}
