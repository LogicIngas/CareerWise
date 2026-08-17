import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { Job, Application } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, Alex <span class="text-2xl">👋</span>
          </h1>
          <p class="text-gray-500 mt-1">Here's what's happening with your job search</p>
        </div>
        <button routerLink="/jobs" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
          Find Jobs
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-gray-900">{{stats()?.applications || 0}}</div>
            <div class="text-sm text-gray-500 font-medium">Applications</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-gray-900">{{stats()?.saved || 0}}</div>
            <div class="text-sm text-gray-500 font-medium">Saved Jobs</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-gray-900">{{stats()?.views || 0}}</div>
            <div class="text-sm text-gray-500 font-medium">Profile Views</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div class="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-gray-900">{{stats()?.interviews || 0}}</div>
            <div class="text-sm text-gray-500 font-medium">Interviews</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content Left -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Recent Applications -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-gray-900">Recent applications</h2>
              <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </a>
            </div>
            
            <div class="space-y-4">
              <div *ngFor="let app of applications()" class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <h3 class="font-bold text-gray-900 text-sm">{{app.jobTitle}}</h3>
                  <p class="text-gray-500 text-xs">{{app.company}}</p>
                </div>
                <span class="px-3 py-1 text-xs font-semibold rounded-full"
                  [ngClass]="{
                    'bg-blue-100 text-blue-700': app.status === 'Interview',
                    'bg-purple-100 text-purple-700': app.status === 'Under Review',
                    'bg-gray-100 text-gray-700': app.status === 'Applied',
                    'bg-red-100 text-red-700': app.status === 'Rejected'
                  }">
                  {{app.status}}
                </span>
              </div>
              <div *ngIf="loadingApps()" class="text-center text-sm text-gray-500 py-4 animate-pulse">
                Loading applications...
              </div>
            </div>
          </div>

          <!-- Recommended for you -->
          <div>
            <h2 class="text-lg font-bold text-gray-900 mb-6">Recommended for you</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-job-card *ngFor="let job of recommendedJobs()" [job]="job"></app-job-card>
            </div>
            <div *ngIf="loadingJobs()" class="text-center text-sm text-gray-500 py-8 animate-pulse">
              Loading recommended jobs...
            </div>
          </div>
        </div>

        <!-- Sidebar Right -->
        <div>
          <!-- Profile Strength -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Profile strength</h2>
            
            <div class="flex items-end gap-2 mb-4">
              <span class="text-3xl font-extrabold text-indigo-600 leading-none">75%</span>
              <span class="text-gray-500 text-sm font-medium pb-1">complete</span>
            </div>
            
            <div class="w-full bg-indigo-50 rounded-full h-2.5 mb-6">
              <div class="bg-indigo-600 h-2.5 rounded-full" style="width: 75%"></div>
            </div>
            
            <p class="text-sm text-gray-600 mb-6">
              Add a portfolio link to boost your visibility.
            </p>
            
            <button class="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Complete profile
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private dataService = inject(MockDataService);

  stats = signal<any>(null);
  applications = signal<Application[]>([]);
  recommendedJobs = signal<Job[]>([]);

  loadingStats = signal(true);
  loadingApps = signal(true);
  loadingJobs = signal(true);

  ngOnInit() {
    this.dataService.getDashboardStats().subscribe(data => {
      this.stats.set(data);
      this.loadingStats.set(false);
    });

    this.dataService.getRecentApplications().subscribe(data => {
      this.applications.set(data);
      this.loadingApps.set(false);
    });

    this.dataService.getFeaturedJobs().subscribe(data => {
      this.recommendedJobs.set(data.slice(0, 2)); // Just take 2 for dashboard
      this.loadingJobs.set(false);
    });
  }
}
