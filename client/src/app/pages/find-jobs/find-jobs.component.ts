import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { Job } from '../../models/models';

@Component({
  selector: 'app-find-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JobCardComponent],
  template: `
    <div class="bg-gray-50/50 min-h-screen pb-20">
      <!-- Header Section -->
      <div class="bg-indigo-50/30 pt-12 pb-16 px-6 md:px-12 border-b border-gray-100">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Find your next role</h1>
          <p class="text-gray-500 mb-8">{{jobs().length}} jobs matching your search</p>

          <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-2">
            <div class="flex-1 flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-100">
              <svg class="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input formControlName="keyword" type="text" placeholder="Job title or company" class="w-full outline-none text-gray-900 placeholder-gray-400">
            </div>
            <div class="flex-1 flex items-center gap-3 px-4 py-3 md:py-2">
              <svg class="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <input formControlName="location" type="text" placeholder="Location" class="w-full outline-none text-gray-900 placeholder-gray-400">
            </div>
            <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-10 rounded-xl transition-colors m-1 md:m-0 shadow-sm">
              Search
            </button>
          </form>
          <div *ngIf="isSearching()" class="text-sm text-indigo-600 mt-4 animate-pulse">Searching for jobs...</div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Filters Sidebar -->
          <aside class="w-full lg:w-64 flex-shrink-0">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div class="flex items-center gap-2 mb-6 text-gray-900 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters
              </div>

              <div class="mb-8">
                <h3 class="text-sm font-semibold text-gray-900 mb-4">Job type</h3>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="w-5 h-5 rounded border border-gray-300 flex items-center justify-center group-hover:border-indigo-500 transition-colors"></div>
                    <span class="text-sm text-gray-600">Full-time</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="w-5 h-5 rounded border border-gray-300 flex items-center justify-center group-hover:border-indigo-500 transition-colors"></div>
                    <span class="text-sm text-gray-600">Part-time</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="w-5 h-5 rounded border border-gray-300 flex items-center justify-center group-hover:border-indigo-500 transition-colors"></div>
                    <span class="text-sm text-gray-600">Contract</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="w-5 h-5 rounded border border-gray-300 flex items-center justify-center group-hover:border-indigo-500 transition-colors"></div>
                    <span class="text-sm text-gray-600">Remote</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <!-- Jobs Grid -->
          <div class="flex-grow">
            <div *ngIf="loadingJobs()" class="text-center text-gray-500 py-12 animate-pulse">
              Loading jobs...
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-job-card *ngFor="let job of jobs()" [job]="job"></app-job-card>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class FindJobsComponent implements OnInit {
  private dataService = inject(MockDataService);
  private fb = inject(FormBuilder);

  jobs = signal<Job[]>([]);
  loadingJobs = signal(true);
  isSearching = signal(false);

  searchForm = this.fb.group({
    keyword: [''],
    location: ['']
  });

  ngOnInit() {
    this.dataService.getFeaturedJobs().subscribe(data => {
      this.jobs.set(data);
      this.loadingJobs.set(false);
    });
  }

  onSearch() {
    this.isSearching.set(true);
    setTimeout(() => {
      this.isSearching.set(false);
      console.log('Search mock sent:', this.searchForm.value);
    }, 800); // Simulate network
  }
}
