import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { Job } from '../../models/models';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">Saved Jobs</h1>
        <p class="text-stone-500 mt-1">{{jobs().length}} jobs saved for later</p>
      </div>

      <div *ngIf="loading()" class="text-center text-stone-500 py-12 animate-pulse">
        Loading saved jobs...
      </div>

      <div *ngIf="!loading() && jobs().length === 0" class="text-center py-16 border border-dashed border-stone-200 rounded-2xl">
        <p class="text-stone-900 font-semibold mb-1">No saved jobs yet</p>
        <p class="text-stone-500 text-sm mb-4">Save roles you're interested in and they'll show up here.</p>
        <a routerLink="/jobs" class="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">Browse open roles</a>
      </div>

      <!-- Jobs Grid -->
      <div *ngIf="!loading() && jobs().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-job-card *ngFor="let job of jobs()" [job]="job"></app-job-card>
      </div>
    </div>
  `
})
export class SavedJobsComponent implements OnInit {
  private dataService = inject(MockDataService);
  
  jobs = signal<Job[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.dataService.getFeaturedJobs().subscribe(data => {
      this.jobs.set(data.slice(0, 4)); // Just take 4 to match the 4 saved jobs in screenshot
      this.loading.set(false);
    });
  }
}
