import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, JobCardComponent],
  template: `
    <main class="min-h-screen bg-white">
      <!-- Hero Section -->
      <section class="bg-brand-50/50 pt-20 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div class="max-w-3xl mx-auto relative z-10">
          <div>
            <h1 class="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight leading-tight mb-6">
              Find the job that<br/>
              <span class="text-brand-600">moves</span> your career<br/>
              forward
            </h1>
            
            <p class="text-lg text-stone-600 mb-10 max-w-lg leading-relaxed">
              Discover thousands of opportunities from top companies. Search, apply, and get hired — all in one place.
            </p>

            <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="bg-white p-2 rounded-2xl shadow-lg border border-stone-100 flex flex-col md:flex-row gap-2 max-w-2xl mb-8">
              <div class="flex-1 flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-stone-100">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input formControlName="keyword" type="text" placeholder="Job title or keyword" class="w-full outline-none text-stone-900 placeholder-stone-400">
              </div>
              <div class="flex-1 flex items-center gap-3 px-4 py-3 md:py-2">
                <svg class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <input formControlName="location" type="text" placeholder="Location" class="w-full outline-none text-stone-900 placeholder-stone-400">
              </div>
              <button type="submit" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-medium py-3 px-8 rounded-xl transition-all m-1 md:m-0">
                Search Jobs
              </button>
            </form>
            
            <div *ngIf="isSearching()" class="text-sm text-brand-600 mb-4 animate-pulse">Searching for jobs...</div>

            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-sm text-stone-500 font-medium">Popular:</span>
              <button type="button" (click)="searchPopular({ location: 'Remote' })" class="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-brand-300 hover:text-brand-700 active:scale-95 transition-all">Remote</button>
              <button type="button" (click)="searchPopular({ keyword: 'React' })" class="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-brand-300 hover:text-brand-700 active:scale-95 transition-all">React</button>
              <button type="button" (click)="searchPopular({ keyword: 'Designer' })" class="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-brand-300 hover:text-brand-700 active:scale-95 transition-all">Designer</button>
              <button type="button" (click)="searchPopular({ keyword: 'Marketing' })" class="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-brand-300 hover:text-brand-700 active:scale-95 transition-all">Marketing</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Jobs -->
      <section class="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-2xl font-bold text-stone-900 mb-2">Featured jobs</h2>
            <p class="text-stone-500">Hand-picked roles for you</p>
          </div>
          <a routerLink="/jobs" class="hidden md:block px-5 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all">
            View all
          </a>
        </div>

        <div *ngIf="loadingJobs()" class="py-12 text-center text-stone-500 animate-pulse">
          Loading featured jobs...
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-job-card *ngFor="let job of featuredJobs()" [job]="job"></app-job-card>
        </div>

        <a routerLink="/jobs" class="md:hidden block text-center w-full mt-8 px-5 py-3 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all">
          View all jobs
        </a>
      </section>

      <!-- Why Choose Us -->
      <section class="bg-[#f5f4f1] py-20">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
          <div class="max-w-2xl mb-16">
            <h2 class="text-3xl font-bold text-stone-900 mb-4 text-balance">Why professionals choose CareerWise</h2>
            <p class="text-stone-500 text-lg text-balance">Everything you need to find and land your next opportunity.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-7 relative overflow-hidden rounded-2xl bg-brand-800 text-white p-10 flex flex-col justify-end min-h-[380px] bg-grain">
              <div class="absolute -top-16 -right-10 w-72 h-72 bg-brand-500/25 rounded-full blur-3xl pointer-events-none"></div>
              <svg class="absolute -right-8 -bottom-12 text-white/[0.06] pointer-events-none" width="340" height="340" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 4 15h9l-2 9 11-13h-9l3-7z"/></svg>
              <div class="relative z-10">
                <div class="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 4 15h9l-2 9 11-13h-9l3-7z"/></svg>
                </div>
                <h3 class="text-2xl font-bold mb-3">One-click apply</h3>
                <p class="text-brand-100 leading-relaxed max-w-sm">Apply to multiple jobs instantly with your CareerWise profile — no re-entering your details or re-uploading your resume for every listing.</p>
              </div>
            </div>

            <div class="lg:col-span-5 flex flex-col gap-6">
              <div class="flex-1 bg-white rounded-2xl border border-stone-200 p-8 flex gap-5 items-start hover:border-stone-300 hover:-translate-y-0.5 transition-all duration-200">
                <div class="w-11 h-11 flex-shrink-0 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.275 1.275L3 12l5.8 1.9a2 2 0 0 1 1.275 1.275L12 21l1.9-5.8a2 2 0 0 1 1.275-1.275L21 12l-5.8-1.9a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-stone-900 mb-2">Smart matching</h3>
                  <p class="text-stone-500 leading-relaxed text-sm">Our engine surfaces roles tailored to your skills and goals, not just keyword matches.</p>
                </div>
              </div>

              <div class="flex-1 bg-white rounded-2xl border border-stone-200 p-8 flex gap-5 items-start hover:border-stone-300 hover:-translate-y-0.5 transition-all duration-200">
                <div class="w-11 h-11 flex-shrink-0 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-stone-900 mb-2">Direct from employers</h3>
                  <p class="text-stone-500 leading-relaxed text-sm">Every listing is posted straight from the hiring company's own account — nothing scraped or resold from other job boards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div class="relative overflow-hidden bg-brand-800 rounded-3xl p-10 md:p-16 text-center shadow-xl bg-grain">
          <div class="absolute -top-24 -right-16 w-72 h-72 bg-brand-600/40 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-16 w-72 h-72 bg-brand-900/60 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to find your dream job?</h2>
            <p class="text-brand-100 mb-10 max-w-2xl mx-auto text-lg">Create your free profile today and get matched with roles built for you.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button routerLink="/signup" class="bg-white text-brand-700 font-bold py-3 px-8 rounded-xl hover:bg-stone-50 active:scale-[0.98] transition-all shadow-sm">
                Get started free
              </button>
              <button routerLink="/post-job" class="bg-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/15 active:scale-[0.98] border border-white/20 transition-all">
                Post a job
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class LandingComponent implements OnInit {
  private jobService = inject(JobService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Signals for state management
  featuredJobs = signal<Job[]>([]);

  // Loading states
  loadingJobs = signal(true);
  isSearching = signal(false);

  // Search form
  searchForm = this.fb.group({
    keyword: [''],
    location: ['']
  });

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.jobService.getOpenPositions().subscribe(data => {
      this.featuredJobs.set(data.slice(0, 6));
      this.loadingJobs.set(false);
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.isSearching.set(true);
      // Simulate network request
      setTimeout(() => {
        this.isSearching.set(false);
        const { keyword, location } = this.searchForm.value;
        this.navigateToJobs({ keyword: keyword ?? undefined, location: location ?? undefined });
      }, 800);
    }
  }

  searchPopular(params: { keyword?: string; location?: string }) {
    this.navigateToJobs(params);
  }

  private navigateToJobs(params: { keyword?: string; location?: string }) {
    const queryParams: Record<string, string> = {};
    if (params.keyword?.trim()) queryParams['keyword'] = params.keyword.trim();
    if (params.location?.trim()) queryParams['location'] = params.location.trim();
    this.router.navigate(['/jobs'], { queryParams });
  }
}
