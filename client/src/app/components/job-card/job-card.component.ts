import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../models/models';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl p-6 border border-stone-200 hover:border-stone-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(26,53,46,0.18)] transition-all duration-200 h-full flex flex-col">
      <div class="flex justify-between items-start mb-4">
        <div class="flex gap-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl {{job.companyColor}}">
            {{job.companyInitial}}
          </div>
          <div>
            <h3 class="font-bold text-stone-900 text-lg">{{job.title}}</h3>
            <p class="text-stone-500 text-sm">{{job.company}}</p>
          </div>
        </div>
        <button aria-label="Save job" class="text-stone-400 hover:text-brand-600 active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </button>
      </div>

      <div class="flex flex-wrap gap-1.5 mb-6">
        <span *ngFor="let tag of job.tags" class="px-2.5 py-1 border border-stone-200 text-stone-600 text-xs font-medium rounded-md">
          {{tag}}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-y-3 mb-6 flex-grow">
        <div class="flex items-center gap-2 text-stone-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          {{job.location}}
        </div>
        <div class="flex items-center gap-2 text-stone-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          {{job.salaryRange}}
        </div>
        <div class="flex items-center gap-2 text-stone-500 text-sm col-span-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{job.postedTime}}
        </div>
      </div>

      <div class="flex items-center justify-between mt-auto">
        <button class="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-medium py-2 px-6 rounded-lg transition-all text-sm w-full md:w-auto text-center flex-1 mr-4">
          View Details
        </button>
        <span class="text-sm font-semibold text-stone-900 whitespace-nowrap">
          {{job.type}}
        </span>
      </div>
    </div>
  `
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
}
