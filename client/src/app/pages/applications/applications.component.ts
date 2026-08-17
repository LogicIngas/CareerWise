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
        <h1 class="text-2xl font-bold text-gray-900">My Applications</h1>
        <p class="text-gray-500 mt-1">Track the status of your applications</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" *ngIf="stats()">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="text-3xl font-extrabold text-blue-600 mb-1">{{stats().total}}</div>
          <div class="text-sm text-gray-500 font-medium">Total</div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="text-3xl font-extrabold text-blue-600 mb-1">{{stats().interviews}}</div>
          <div class="text-sm text-gray-500 font-medium">Interviews</div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="text-3xl font-extrabold text-blue-600 mb-1">{{stats().offers}}</div>
          <div class="text-sm text-gray-500 font-medium">Offers</div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-sm font-semibold text-gray-500">
              <th class="py-4 px-6 font-medium">Position</th>
              <th class="py-4 px-6 font-medium">Company</th>
              <th class="py-4 px-6 font-medium">Date applied</th>
              <th class="py-4 px-6 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-sm">
            <tr *ngFor="let app of applications()" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6 font-bold text-gray-900">{{app.jobTitle}}</td>
              <td class="py-4 px-6 text-gray-600">{{app.company}}</td>
              <td class="py-4 px-6 text-gray-600">{{app.dateApplied}}</td>
              <td class="py-4 px-6">
                <span class="px-3 py-1 text-xs font-bold rounded-full border"
                  [ngClass]="{
                    'bg-blue-600 text-white border-blue-600': app.status === 'Interview' || app.status === 'Offer',
                    'bg-purple-50 text-purple-700 border-purple-100': app.status === 'Under Review',
                    'bg-white text-gray-700 border-gray-200': app.status === 'Applied',
                    'bg-red-600 text-white border-red-600': app.status === 'Rejected'
                  }">
                  {{app.status}}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="loading()" class="p-8 text-center text-gray-500 animate-pulse">
          Loading applications...
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
