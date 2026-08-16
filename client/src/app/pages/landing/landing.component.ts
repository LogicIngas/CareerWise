import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { MockDataService } from '../../services/mock-data.service';
import { Category, Job, Stat } from '../../models/models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JobCardComponent],
  template: `
    <main class="min-h-screen bg-white">
      <!-- Hero Section -->
      <section class="bg-indigo-50/50 pt-20 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-indigo-600 font-medium text-sm mb-6 shadow-sm border border-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              #1 Job platform of 2026
            </div>
            
            <h1 class="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              Find the job that<br/>
              <span class="text-indigo-600">moves</span> your career<br/>
              forward
            </h1>
            
            <p class="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              Discover thousands of opportunities from top companies. Search, apply, and get hired — all in one place.
            </p>

            <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-2 max-w-2xl mb-8">
              <div class="flex-1 flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-100">
                <svg class="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input formControlName="keyword" type="text" placeholder="Job title or keyword" class="w-full outline-none text-gray-900 placeholder-gray-400">
              </div>
              <div class="flex-1 flex items-center gap-3 px-4 py-3 md:py-2">
                <svg class="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <input formControlName="location" type="text" placeholder="Location" class="w-full outline-none text-gray-900 placeholder-gray-400">
              </div>
              <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-colors m-1 md:m-0">
                Search Jobs
              </button>
            </form>
            
            <div *ngIf="isSearching()" class="text-sm text-indigo-600 mb-4 animate-pulse">Searching for jobs...</div>

            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-sm text-gray-500 font-medium">Popular:</span>
              <button class="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors">Remote</button>
              <button class="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors">React</button>
              <button class="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors">Designer</button>
              <button class="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors">Marketing</button>
            </div>
          </div>
          
          <div class="hidden lg:block relative">
            <div class="absolute inset-0 bg-indigo-200 rounded-[3rem] blur-3xl opacity-20 transform rotate-6 scale-105"></div>
            <div class="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-indigo-50/50 relative z-10 aspect-[4/3] flex flex-col items-center justify-center">
              <!-- Placeholder for hero illustration -->
              <div class="w-full h-full bg-indigo-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-indigo-100 overflow-hidden">
                <div class="flex flex-col items-center">
                  <div class="flex items-end justify-center mb-4">
                     <div class="w-16 h-16 bg-blue-400 rounded-full mx-2 shadow-lg"></div>
                     <div class="w-20 h-20 bg-indigo-500 rounded-full mx-2 shadow-lg z-10 -mb-2"></div>
                     <div class="w-16 h-16 bg-orange-400 rounded-full mx-2 shadow-lg"></div>
                  </div>
                  <div class="w-64 h-40 bg-gray-900 rounded-t-xl relative mx-auto mt-4 shadow-xl border-4 border-gray-900">
                    <div class="absolute inset-0 bg-indigo-100 p-2"></div>
                  </div>
                  <div class="w-80 h-3 bg-gray-900 rounded-b-xl shadow-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="max-w-7xl mx-auto px-6 md:px-12 py-16 -mt-10 relative z-20">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div *ngFor="let stat of stats()" class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 text-center flex flex-col items-center">
            <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <!-- Render icon based on stat name -->
              <ng-container [ngSwitch]="stat.icon">
                <svg *ngSwitchCase="'work'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <svg *ngSwitchCase="'business'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                <svg *ngSwitchCase="'people'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <svg *ngSwitchCase="'trending_up'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </ng-container>
            </div>
            <h2 class="text-3xl font-extrabold text-gray-900 mb-1">{{stat.value}}</h2>
            <p class="text-gray-500 font-medium">{{stat.label}}</p>
          </div>
          
          <div *ngIf="loadingStats()" class="col-span-full py-8 text-center text-gray-500 animate-pulse">
            Loading statistics...
          </div>
        </div>
      </section>

      <!-- Browse by Category -->
      <section class="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Browse by category</h2>
        
        <div *ngIf="loadingCategories()" class="py-8 text-center text-gray-500 animate-pulse">
          Loading categories...
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button *ngFor="let cat of categories()" class="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
            <span class="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{{cat.name}}</span>
            <svg class="text-gray-400 group-hover:text-indigo-600 transition-colors" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      <!-- Featured Jobs -->
      <section class="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Featured jobs</h2>
            <p class="text-gray-500">Hand-picked roles for you</p>
          </div>
          <button class="hidden md:block px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View all
          </button>
        </div>
        
        <div *ngIf="loadingJobs()" class="py-12 text-center text-gray-500 animate-pulse">
          Loading featured jobs...
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-job-card *ngFor="let job of featuredJobs()" [job]="job"></app-job-card>
        </div>
        
        <button class="md:hidden w-full mt-8 px-5 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          View all jobs
        </button>
      </section>

      <!-- Why Choose Us -->
      <section class="bg-indigo-50/30 py-20">
        <div class="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Why professionals choose CareerWise</h2>
          <p class="text-gray-500 max-w-2xl mx-auto mb-16 text-lg">Everything you need to find and land your next opportunity.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 4 15h9l-2 9 11-13h-9l3-7z"/></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">One-Click Apply</h3>
              <p class="text-gray-500 leading-relaxed">Apply to multiple jobs instantly with your smart CareerWise profile.</p>
            </div>
            
            <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.275 1.275L3 12l5.8 1.9a2 2 0 0 1 1.275 1.275L12 21l1.9-5.8a2 2 0 0 1 1.275-1.275L21 12l-5.8-1.9a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
              <p class="text-gray-500 leading-relaxed">Our engine surfaces roles tailored to your skills and goals.</p>
            </div>
            
            <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Verified Employers</h3>
              <p class="text-gray-500 leading-relaxed">Every company is vetted so you apply with total confidence.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-10 md:p-16 text-center shadow-xl">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to find your dream job?</h2>
          <p class="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg">Create your free profile today and get matched with roles built for you.</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button class="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              Get started free
            </button>
            <button class="bg-indigo-500/30 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-500/40 border border-indigo-400/50 transition-colors">
              Post a job
            </button>
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
  stats = signal<Stat[]>([]);
  categories = signal<Category[]>([]);
  featuredJobs = signal<Job[]>([]);
  
  // Loading states
  loadingStats = signal(true);
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
    this.dataService.getStats().subscribe(data => {
      this.stats.set(data);
      this.loadingStats.set(false);
    });

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
