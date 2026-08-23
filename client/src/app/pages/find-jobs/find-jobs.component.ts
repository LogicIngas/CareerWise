import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/models';

// Reads figures out of free-text salary strings like "R900,000 - R1,300,000/yr"
// or "R450/hr", handling both comma-grouped and "k"-shorthand numbers.
function parseSalaryFigures(salaryRange: string): { low: number; high: number } | null {
  const isK = /\dk\b/i.test(salaryRange);
  const rawMatches = salaryRange.match(/\d[\d,]*/g);
  if (!rawMatches || rawMatches.length === 0) return null;

  const nums = rawMatches.map(raw => {
    let n = parseInt(raw.replace(/,/g, ''), 10);
    if (isK) n *= 1000;
    return n;
  });

  return { low: Math.min(...nums), high: Math.max(...nums) };
}

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
          <p class="text-stone-500 mb-8">Showing {{filteredJobs().length}} of {{jobs().length}} available opportunities</p>

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

      <!-- Content Section with 280px Left Sidebar -->
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Left Sidebar (width: 280px) -->
          <aside class="w-full lg:w-[280px] flex-shrink-0">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 sticky top-24 space-y-6">
              
              <div class="flex items-center justify-between pb-4 border-b border-stone-100">
                <div class="flex items-center gap-2 text-stone-900 font-bold text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  Filters
                </div>
                <button *ngIf="hasActiveFilters()" (click)="clearAllFilters()" class="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  Reset All
                </button>
              </div>

              <!-- Total Jobs Counter Badge -->
              <div class="bg-stone-50 rounded-xl p-3 text-xs text-stone-600 flex items-center justify-between">
                <span>Total Openings:</span>
                <span class="font-bold text-stone-900 bg-white px-2.5 py-0.5 rounded-lg border border-stone-200">
                  {{ jobs().length }}
                </span>
              </div>

              <!-- Job Type Filter -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-bold text-stone-900">Employment Type</h3>
                  <button *ngIf="selectedTypes().length" (click)="selectedTypes.set([])" class="text-xs font-medium text-brand-600 hover:text-brand-700">Clear</button>
                </div>
                <div class="space-y-2.5">
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
                    <span class="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">Remote Only</span>
                  </label>
                </div>
              </div>

              <!-- Minimum Salary Filter -->
              <div class="pt-4 border-t border-stone-100">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-bold text-stone-900">Minimum Salary</h3>
                  <button *ngIf="selectedMinSalary() > 0" (click)="selectedMinSalary.set(0)" class="text-xs font-medium text-brand-600 hover:text-brand-700">Clear</button>
                </div>
                <div class="space-y-2">
                  <button
                    type="button"
                    *ngFor="let option of minSalaryOptions"
                    (click)="selectedMinSalary.set(option.value)"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between"
                    [ngClass]="selectedMinSalary() === option.value ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-stone-600 hover:bg-stone-50 border border-transparent'">
                    <span>{{ option.label }}</span>
                    <span *ngIf="selectedMinSalary() === option.value" class="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                  </button>
                </div>
              </div>

              <!-- Maximum Salary Filter -->
              <div class="pt-4 border-t border-stone-100">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-bold text-stone-900">Maximum Salary</h3>
                  <button *ngIf="selectedMaxSalary() > 0" (click)="selectedMaxSalary.set(0)" class="text-xs font-medium text-brand-600 hover:text-brand-700">Clear</button>
                </div>
                <div class="space-y-2">
                  <button
                    type="button"
                    *ngFor="let option of maxSalaryOptions"
                    (click)="selectedMaxSalary.set(option.value)"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between"
                    [ngClass]="selectedMaxSalary() === option.value ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-stone-600 hover:bg-stone-50 border border-transparent'">
                    <span>{{ option.label }}</span>
                    <span *ngIf="selectedMaxSalary() === option.value" class="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                  </button>
                </div>
              </div>

            </div>
          </aside>

          <!-- Jobs Grid -->
          <div class="flex-grow">
            <div *ngIf="loadingJobs()" class="text-center text-stone-500 py-16 animate-pulse">
              <div class="inline-block p-3 rounded-full bg-brand-50 text-brand-600 mb-3">
                <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              </div>
              <p class="font-medium text-stone-700">Loading open positions...</p>
            </div>

            <div *ngIf="!loadingJobs() && filteredJobs().length === 0" class="text-center py-20 bg-white border border-dashed border-stone-200 rounded-3xl p-8">
              <div class="w-14 h-14 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3 class="text-base font-bold text-stone-900 mb-1">No matching jobs found</h3>
              <p class="text-stone-500 text-xs mb-5 max-w-xs mx-auto">Try loosening your search terms or clearing your sidebar filters.</p>
              <button (click)="clearAllFilters()" class="px-5 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all">
                Clear all filters
              </button>
            </div>

            <div *ngIf="!loadingJobs() && filteredJobs().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  selectedMinSalary = signal<number>(0);
  selectedMaxSalary = signal<number>(0);
  appliedKeyword = signal('');
  appliedLocation = signal('');

  minSalaryOptions = [
    { label: 'All Salaries', value: 0 },
    { label: 'R400,000+ / yr', value: 400000 },
    { label: 'R700,000+ / yr', value: 700000 },
    { label: 'R1,000,000+ / yr', value: 1000000 }
  ];

  maxSalaryOptions = [
    { label: 'No maximum', value: 0 },
    { label: 'Up to R600,000 / yr', value: 600000 },
    { label: 'Up to R900,000 / yr', value: 900000 },
    { label: 'Up to R1,200,000 / yr', value: 1200000 }
  ];

  hasActiveFilters = computed(() => {
    return this.selectedTypes().length > 0
      || this.selectedMinSalary() > 0
      || this.selectedMaxSalary() > 0
      || !!this.appliedKeyword()
      || !!this.appliedLocation();
  });

  filteredJobs = computed(() => {
    const types = this.selectedTypes();
    const minSalary = this.selectedMinSalary();
    const maxSalary = this.selectedMaxSalary();
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

      let matchesSalary = true;
      if ((minSalary > 0 || maxSalary > 0) && job.salaryRange) {
        const range = parseSalaryFigures(job.salaryRange);
        if (range) {
          if (minSalary > 0 && range.low < minSalary) matchesSalary = false;
          if (maxSalary > 0 && range.high > maxSalary) matchesSalary = false;
        }
      }

      return matchesType && matchesKeyword && matchesLocation && matchesSalary;
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
    this.loadBaseJobs();
  }

  clearAllFilters() {
    this.selectedTypes.set([]);
    this.selectedMinSalary.set(0);
    this.selectedMaxSalary.set(0);
    this.appliedKeyword.set('');
    this.appliedLocation.set('');
    this.searchForm.reset({ keyword: '', location: '' });
    this.loadBaseJobs();
  }

  ngOnInit() {
    const keyword = this.route.snapshot.queryParamMap.get('keyword') ?? '';
    const location = this.route.snapshot.queryParamMap.get('location') ?? '';
    if (keyword || location) {
      this.searchForm.patchValue({ keyword, location });
      this.appliedKeyword.set(keyword);
      this.appliedLocation.set(location);
    }

    this.loadBaseJobs();
  }

  onSearch() {
    this.isSearching.set(true);
    this.appliedKeyword.set(this.searchForm.value.keyword ?? '');
    this.appliedLocation.set(this.searchForm.value.location ?? '');
    this.loadBaseJobs();
  }

  // Fetches the most relevant server-side result set for the currently
  // applied search/filter combination, then narrows further with the
  // in-memory filters in `filteredJobs` (keyword, salary, extra types).
  private loadBaseJobs() {
    this.loadingJobs.set(true);
    this.isSearching.set(true);

    const location = this.appliedLocation().trim();
    const types = this.selectedTypes();

    let source$: Observable<Job[]>;
    if (location) {
      source$ = this.jobService.findByLocation(location);
    } else if (types.length === 1 && types[0] === 'Remote') {
      source$ = this.jobService.findByRemoteOption(true);
    } else if (types.length === 1 && types[0] !== 'Remote') {
      source$ = this.jobService.findByEmploymentType(types[0]);
    } else {
      source$ = this.jobService.getOpenPositions();
    }

    source$.subscribe(data => {
      this.jobs.set(data);
      this.loadingJobs.set(false);
      this.isSearching.set(false);
    });
  }
}
