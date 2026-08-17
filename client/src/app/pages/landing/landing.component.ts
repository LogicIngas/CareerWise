import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { Category, Job } from '../../models/models';

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
              <button class="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-brand-300 hover:text-brand-700 active:scale-95 transition-all">Remote</button>
              <button class="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-brand-300 hover:text-brand-700 active:scale-95 transition-all">React</button>
              <button class="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-brand-300 hover:text-brand-700 active:scale-95 transition-all">Designer</button>
              <button class="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-brand-300 hover:text-brand-700 active:scale-95 transition-all">Marketing</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Browse by Category -->
      <section class="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <h2 class="text-2xl font-bold text-stone-900 mb-8">Browse by category</h2>
        
        <div *ngIf="loadingCategories()" class="py-8 text-center text-stone-500 animate-pulse">
          Loading categories...
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button *ngFor="let cat of categories()" class="bg-white border border-stone-200 rounded-xl p-5 flex items-center justify-between hover:border-brand-300 hover:-translate-y-0.5 active:scale-[0.98] transition-all group">
            <span class="font-medium text-stone-900 group-hover:text-brand-600 transition-colors">{{cat.name}}</span>
            <svg class="text-stone-400 group-hover:text-brand-600 transition-colors" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
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
            <h2 class="text-3xl font-bold text-stone-900 mb-4">Why professionals choose CareerWise</h2>
            <p class="text-stone-500 text-lg">Everything you need to find and land your next opportunity.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-7 relative overflow-hidden rounded-2xl bg-brand-800 text-white p-10 flex flex-col justify-end min-h-[380px] bg-grain">
              <img src="https://picsum.photos/seed/careerwise-apply/900/700" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25" />
              <div class="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/50 to-transparent"></div>
              <div class="relative z-10">
                <div class="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 4 15h9l-2 9 11-13h-9l3-7z"/></svg>
                </div>
                <h3 class="text-2xl font-bold mb-3">One-click apply</h3>
                <p class="text-brand-100 leading-relaxed max-w-sm">Apply to multiple jobs instantly with your smart CareerWise profile — no repetitive forms.</p>
              </div>
            </div>

            <div class="lg:col-span-5 flex flex-col gap-6">
              <div class="flex-1 bg-white rounded-2xl border border-stone-200 p-8 flex gap-5 items-start">
                <div class="w-11 h-11 flex-shrink-0 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.275 1.275L3 12l5.8 1.9a2 2 0 0 1 1.275 1.275L12 21l1.9-5.8a2 2 0 0 1 1.275-1.275L21 12l-5.8-1.9a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-stone-900 mb-2">Smart matching</h3>
                  <p class="text-stone-500 leading-relaxed text-sm">Our engine surfaces roles tailored to your skills and goals, not just keyword matches.</p>
                </div>
              </div>

              <div class="flex-1 bg-white rounded-2xl border border-stone-200 p-8 flex gap-5 items-start">
                <div class="w-11 h-11 flex-shrink-0 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-stone-900 mb-2">Verified employers</h3>
                  <p class="text-stone-500 leading-relaxed text-sm">Every company on CareerWise is vetted, so you apply with total confidence.</p>
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
  private dataService = inject(MockDataService);
  private fb = inject(FormBuilder);

  // Signals for state management
  categories = signal<Category[]>([]);
  featuredJobs = signal<Job[]>([]);

  // Loading states
  loadingCategories = signal(true);
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
    this.dataService.getCategories().subscribe(data => {
      this.categories.set(data);
      this.loadingCategories.set(false);
    });

    this.dataService.getFeaturedJobs().subscribe(data => {
      this.featuredJobs.set(data);
      this.loadingJobs.set(false);
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.isSearching.set(true);
      // Simulate network request
      setTimeout(() => {
        this.isSearching.set(false);
        console.log('Search criteria:', this.searchForm.value);
        // In a real app, this would refresh the jobs list
      }, 800);
    }
  }
}
