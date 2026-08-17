import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../models/models';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div class="flex justify-between items-start mb-4">
        <div class="flex gap-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl {{job.companyColor}}">
            {{job.companyInitial}}
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-lg">{{job.title}}</h3>
            <p class="text-gray-500 text-sm">{{job.company}}</p>
          </div>
        </div>
        <button class="text-gray-400 hover:text-indigo-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </button>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        <span *ngFor="let tag of job.tags" class="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
          {{tag}}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-y-3 mb-6 flex-grow">
        <div class="flex items-center gap-2 text-gray-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          {{job.location}}
        </div>
        <div class="flex items-center gap-2 text-gray-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          {{job.salaryRange}}
        </div>
        <div class="flex items-center gap-2 text-gray-500 text-sm col-span-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{job.postedTime}}
        </div>
      </div>

      <div class="flex items-center justify-between mt-auto">
        <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm w-full md:w-auto text-center flex-1 mr-4">
          View Details
        </button>
        <span class="text-sm font-semibold text-gray-900 whitespace-nowrap">
          {{job.type}}
        </span>
      </div>
    </div>
  `
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
}
