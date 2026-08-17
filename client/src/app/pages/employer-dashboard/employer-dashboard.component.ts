import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';
import { EmployerStat, EmployerPosting } from '../../models/models';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-stone-900">{{ companyName() ? companyName() + ' · Hiring' : 'Employer Dashboard' }}</h1>
          <p class="text-stone-500 mt-1">Overview of your hiring pipeline</p>
        </div>
        <button routerLink="/post-job" class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Post Job
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div *ngFor="let stat of stats()" class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between h-32">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
               [ngClass]="{
                 'bg-blue-50 text-blue-600': stat.icon === 'briefcase',
                 'bg-purple-50 text-purple-600': stat.icon === 'users',
                 'bg-brand-50 text-brand-600': stat.icon === 'eye',
                 'bg-pink-50 text-pink-600': stat.icon === 'file'
               }">
            <ng-container [ngSwitch]="stat.icon">
              <svg *ngSwitchCase="'briefcase'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <svg *ngSwitchCase="'users'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <svg *ngSwitchCase="'eye'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg *ngSwitchCase="'file'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
            </ng-container>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-stone-900">{{stat.value}}</div>
            <div class="text-sm text-stone-500 font-medium">{{stat.label}}</div>
          </div>
        </div>
        <div *ngIf="loadingStats()" class="col-span-full py-8 text-center text-stone-500 animate-pulse">
          Loading statistics...
        </div>
      </div>

      <!-- Job Postings -->
      <div class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div class="p-6 border-b border-stone-100">
          <h2 class="text-lg font-bold text-stone-900">Your job postings</h2>
        </div>

        <div class="divide-y divide-stone-50">
          <div *ngFor="let post of postings()" class="p-6 flex justify-between items-center hover:bg-stone-50/50 transition-colors">
            <div>
              <h3 class="font-bold text-stone-900 mb-1">{{post.title}}</h3>
              <p class="text-sm text-stone-500">{{post.applicantsCount}} applicants</p>
            </div>
            <span class="px-3 py-1.5 text-xs font-bold rounded-md"
              [ngClass]="{
                'bg-brand-600 text-white': post.status === 'Active',
                'bg-stone-100 text-stone-600': post.status === 'Paused',
                'bg-red-50 text-red-700 border border-red-100': post.status === 'Closed'
              }">
              {{post.status}}
            </span>
          </div>
          <div *ngIf="loadingPostings()" class="p-8 text-center text-stone-500 animate-pulse">
            Loading postings...
          </div>
          <div *ngIf="!loadingPostings() && postings().length === 0" class="p-12 text-center">
            <p class="text-stone-900 font-semibold mb-1">No job postings yet</p>
            <p class="text-stone-500 text-sm">Post your first role to start receiving applicants.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployerDashboardComponent implements OnInit {
  private dataService = inject(MockDataService);
  private auth = inject(AuthService);

  stats = signal<EmployerStat[]>([]);
  postings = signal<EmployerPosting[]>([]);

  loadingStats = signal(true);
  loadingPostings = signal(true);

  companyName = () => this.auth.currentUser()?.companyName ?? null;

  ngOnInit() {
    this.dataService.getEmployerStats().subscribe(data => {
      this.stats.set(data);
      this.loadingStats.set(false);
    });

    this.dataService.getEmployerPostings().subscribe(data => {
      this.postings.set(data);
      this.loadingPostings.set(false);
    });
  }
}
