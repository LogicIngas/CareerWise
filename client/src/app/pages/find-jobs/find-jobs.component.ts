import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/models';

@Component({
  selector: 'app-find-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JobCardComponent],
  template: `
    <div class="bg-stone-50/50 min-h-screen pb-20">
      <!-- Header Section -->
      <div class="bg-brand-50/30 pt-12 pb-16 px-6 md:px-12 border-b border-stone-100">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl md:text-4xl font-extrabold text-stone-900 mb-2">Find your next role</h1>
          <p class="text-stone-500 mb-8">{{filteredJobs().length}} jobs matching your search</p>

          <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="bg-white p-2 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row gap-2">
            <div class="flex-1 flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-stone-100">
              <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input formControlName="keyword" type="text" placeholder="Job title or company" class="w-full outline-none text-stone-900 placeholder-stone-400">
            </div>
            <div class="flex-1 flex items-center gap-3 px-4 py-3 md:py-2">
              <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <input formControlName="location" type="text" placeholder="Location" class="w-full outline-none text-stone-900 placeholder-stone-400">
            </div>
            <button type="submit" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-medium py-3 px-10 rounded-xl transition-all m-1 md:m-0 shadow-sm">
              Search
            </button>
          </form>
          <div *ngIf="isSearching()" class="text-sm text-brand-600 mt-4 animate-pulse">Searching for jobs...</div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Filters Sidebar -->
          <aside class="w-full lg:w-64 flex-shrink-0">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 sticky top-24">
              <div class="flex items-center gap-2 mb-6 text-stone-900 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters
              </div>

              <div class="mb-2">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-semibold text-stone-900">Job type</h3>
                  <button *ngIf="selectedTypes().length" (click)="selectedTypes.set([])" class="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors">Clear</button>
                </div>
                <div class="space-y-3">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" [checked]="selectedTypes().includes('Full-time')" (change)="toggleType('Full-time')" class="w-4 h-4 rounded border-stone-300 accent-[var(--color-brand-600)] cursor-pointer">
                    <span class="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">Full-time</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" [checked]="selectedTypes().includes('Part-time')" (change)="toggleType('Part-time')" class="w-4 h-4 rounded border-stone-300 accent-[var(--color-brand-600)] cursor-pointer">
                    <span class="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">Part-time</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" [checked]="selectedTypes().includes('Contract')" (change)="toggleType('Contract')" class="w-4 h-4 rounded border-stone-300 accent-[var(--color-brand-600)] cursor-pointer">
                    <span class="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">Contract</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" [checked]="selectedTypes().includes('Remote')" (change)="toggleType('Remote')" class="w-4 h-4 rounded border-stone-300 accent-[var(--color-brand-600)] cursor-pointer">
                    <span class="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">Remote</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <!-- Jobs Grid -->
          <div class="flex-grow">
            <div *ngIf="loadingJobs()" class="text-center text-stone-500 py-12 animate-pulse">
              Loading jobs...
            </div>
            <div *ngIf="!loadingJobs() && filteredJobs().length === 0" class="text-center py-16 border border-dashed border-stone-200 rounded-2xl">
              <p class="text-stone-900 font-semibold mb-1">No jobs match these filters</p>
              <p class="text-stone-500 text-sm mb-4">Try clearing a filter or searching a different keyword.</p>
              <button (click)="clearAllFilters()" class="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">Clear filters</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-job-card *ngFor="let job of filteredJobs()" [job]="job"></app-job-card>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class FindJobsComponent implements OnInit {
  private jobService = inject(JobService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  jobs = signal<Job[]>([]);
  loadingJobs = signal(true);
  isSearching = signal(false);
  selectedTypes = signal<string[]>([]);
  appliedKeyword = signal('');
  appliedLocation = signal('');

  filteredJobs = computed(() => {
    const types = this.selectedTypes();
    const keyword = this.appliedKeyword().trim().toLowerCase();
    const location = this.appliedLocation().trim().toLowerCase();

    return this.jobs().filter(job => {
      const matchesType = !types.length
        || types.includes(job.type)
        || (types.includes('Remote') && job.isRemote);

      const matchesKeyword = !keyword
        || job.title.toLowerCase().includes(keyword)
        || job.company.toLowerCase().includes(keyword)
        || job.tags.some(tag => tag.toLowerCase().includes(keyword));

      const matchesLocation = !location || job.location.toLowerCase().includes(location);

      return matchesType && matchesKeyword && matchesLocation;
    });
  });

  searchForm = this.fb.group({
    keyword: [''],
    location: ['']
  });

  toggleType(type: string) {
    this.selectedTypes.update(types =>
      types.includes(type) ? types.filter(t => t !== type) : [...types, type]
    );
  }

  clearAllFilters() {
    this.selectedTypes.set([]);
    this.appliedKeyword.set('');
    this.appliedLocation.set('');
    this.searchForm.reset({ keyword: '', location: '' });
  }

  ngOnInit() {
    const keyword = this.route.snapshot.queryParamMap.get('keyword') ?? '';
    const location = this.route.snapshot.queryParamMap.get('location') ?? '';
    if (keyword || location) {
      this.searchForm.patchValue({ keyword, location });
      this.appliedKeyword.set(keyword);
      this.appliedLocation.set(location);
    }

    this.jobService.getOpenPositions().subscribe(data => {
      this.jobs.set(data);
      this.loadingJobs.set(false);
    });
  }

  onSearch() {
    this.isSearching.set(true);
    setTimeout(() => {
      this.isSearching.set(false);
      this.appliedKeyword.set(this.searchForm.value.keyword ?? '');
      this.appliedLocation.set(this.searchForm.value.location ?? '');
    }, 800); // Simulate network
  }
}
