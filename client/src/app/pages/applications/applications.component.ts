import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">My Applications</h1>
        <p class="text-stone-500 mt-1">Track the status of your applications</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" *ngIf="stats()">
        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <div class="text-3xl font-extrabold text-stone-900 mb-1">{{stats().total}}</div>
          <div class="text-sm text-stone-500 font-medium">Total</div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <div class="text-3xl font-extrabold text-brand-600 mb-1">{{stats().interviews}}</div>
          <div class="text-sm text-stone-500 font-medium">Interviews</div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-stone-200">
          <div class="text-3xl font-extrabold text-brand-600 mb-1">{{stats().offers}}</div>
          <div class="text-sm text-stone-500 font-medium">Offers</div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-stone-200 text-sm font-semibold text-stone-500">
              <th class="py-4 px-6 font-medium">Position</th>
              <th class="py-4 px-6 font-medium">Company</th>
              <th class="py-4 px-6 font-medium">Date applied</th>
              <th class="py-4 px-6 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-sm">
            <tr *ngFor="let app of applications()" class="hover:bg-stone-50/50 transition-colors">
              <td class="py-4 px-6 font-bold text-stone-900">{{app.jobTitle}}</td>
              <td class="py-4 px-6 text-stone-600">{{app.company}}</td>
              <td class="py-4 px-6 text-stone-600">{{app.dateApplied}}</td>
              <td class="py-4 px-6">
                <span class="px-3 py-1 text-xs font-bold rounded-md border"
                  [ngClass]="{
                    'bg-brand-600 text-white border-brand-600': app.status === 'Interview' || app.status === 'Offer',
                    'bg-purple-50 text-purple-700 border-purple-100': app.status === 'Under Review',
                    'bg-white text-stone-700 border-stone-200': app.status === 'Applied',
                    'bg-red-600 text-white border-red-600': app.status === 'Rejected'
                  }">
                  {{app.status}}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="loading()" class="p-8 text-center text-stone-500 animate-pulse">
          Loading applications...
        </div>
        <div *ngIf="!loading() && applications().length === 0" class="p-12 text-center">
          <p class="text-stone-900 font-semibold mb-1">No applications yet</p>
          <p class="text-stone-500 text-sm">Jobs you apply to will show up here so you can track their status.</p>
        </div>
      </div>
    </div>
  `
})
export class ApplicationsComponent implements OnInit {
  private dataService = inject(MockDataService);
  
  stats = signal<any>(null);
  applications = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.dataService.getDetailedApplications().subscribe(data => {
      this.stats.set(data.stats);
      this.applications.set(data.list);
      this.loading.set(false);
    });
  }
}
