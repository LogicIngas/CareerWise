import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { Job } from '../../models/models';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, JobCardComponent],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p class="text-gray-500 mt-1">{{jobs().length}} jobs saved for later</p>
      </div>

      <!-- Jobs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-job-card *ngFor="let job of jobs()" [job]="job"></app-job-card>
      </div>
      
      <div *ngIf="loading()" class="text-center text-gray-500 py-12 animate-pulse">
        Loading saved jobs...
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
