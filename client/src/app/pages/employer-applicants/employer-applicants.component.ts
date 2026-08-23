import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { JobService } from '../../services/job.service';
import { Application, Job } from '../../models/models';

@Component({
  selector: 'app-employer-applicants',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 max-w-4xl mx-auto pb-20">
      <a routerLink="/employer-home" class="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-700 transition-colors mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to dashboard
      </a>

      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">{{ job()?.title || 'Applicants' }}</h1>
        <p class="text-stone-500 mt-1">{{ applicants().length }} candidate{{ applicants().length === 1 ? '' : 's' }} applied</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div class="divide-y divide-stone-50">
          <div *ngFor="let app of applicants()" class="p-6 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
            <div class="min-w-0 flex-1">
              <h3 class="font-bold text-stone-900 text-sm">{{ app.applicantName }}</h3>
              <p class="text-xs text-stone-500 mt-0.5 truncate">{{ app.applicantEmail }}</p>
              <p class="text-xs text-stone-400 mt-1">Applied {{ app.dateApplied }}</p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span class="px-3 py-1 text-xs font-semibold rounded-md border"
                [ngClass]="{
                  'bg-brand-50 text-brand-700 border-brand-200': app.status === 'Interview' || app.status === 'Offer',
                  'bg-purple-50 text-purple-700 border-purple-200': app.status === 'Under Review',
                  'bg-stone-100 text-stone-700 border-stone-200': app.status === 'Applied',
                  'bg-red-50 text-red-700 border-red-200': app.status === 'Rejected'
                }">
                {{ app.status }}
              </span>
              <a *ngIf="app.jobSeekerId" [routerLink]="['/employer-candidate', app.jobSeekerId]"
                class="px-4 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-all whitespace-nowrap">
                View Profile
              </a>
            </div>
          </div>

          <div *ngIf="loading()" class="p-12 text-center text-stone-500 animate-pulse">
            Loading applicants...
          </div>

          <div *ngIf="!loading() && applicants().length === 0" class="p-12 text-center">
            <p class="text-stone-900 font-semibold mb-1">No applicants yet</p>
            <p class="text-stone-500 text-sm">Candidates who apply to this role will show up here.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployerApplicantsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);

  job = signal<Job | null>(null);
  applicants = signal<Application[]>([]);
  loading = signal(true);

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('jobId');
    if (!jobId) {
      this.loading.set(false);
      return;
    }

    this.jobService.getById(jobId).subscribe(job => this.job.set(job));
    this.applicationService.getApplicationsByJob(jobId).subscribe(apps => {
      this.applicants.set(apps);
      this.loading.set(false);
    });
  }
}
