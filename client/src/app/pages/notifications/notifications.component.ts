import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
          <p class="text-gray-500 mt-1">Stay up to date with your job search</p>
        </div>
        <button class="border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          Mark all read
        </button>
      </div>

      <!-- Notifications List -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="divide-y divide-gray-50">
          <div *ngFor="let notif of notifications()" class="p-6 flex items-start gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer" [class.bg-indigo-50]="notif.unread" [class.bg-opacity-20]="notif.unread">
            <!-- Icon -->
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                 [ngClass]="{
                   'bg-indigo-50 text-indigo-600': notif.type === 'application_view' || notif.type === 'job_match',
                   'bg-purple-50 text-purple-600': notif.type === 'message',
                   'bg-blue-50 text-blue-600': notif.type === 'profile_view'
                 }">
                 
                 <ng-container [ngSwitch]="notif.type">
                   <!-- check-circle -->
                   <svg *ngSwitchCase="'application_view'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                   <!-- message-square -->
                   <svg *ngSwitchCase="'message'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                   <!-- briefcase -->
                   <svg *ngSwitchCase="'job_match'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                   <!-- eye -->
                   <svg *ngSwitchCase="'profile_view'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                 </ng-container>
            </div>
            
            <!-- Content -->
            <div class="flex-grow">
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-gray-900 text-sm mb-1">{{notif.title}}</h3>
                <div *ngIf="notif.unread" class="w-2 h-2 rounded-full bg-blue-600 mt-1.5"></div>
              </div>
              <p class="text-sm text-gray-600 mb-1.5">{{notif.message}}</p>
              <p class="text-xs text-gray-400 font-medium">{{notif.time}}</p>
            </div>
          </div>
          <div *ngIf="loading()" class="p-8 text-center text-gray-500 animate-pulse">
            Loading notifications...
          </div>
        </div>
      </div>
      
      <div class="mt-8 flex justify-center items-center text-sm font-medium text-gray-400 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        You're all caught up
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  private dataService = inject(MockDataService);
  
  notifications = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.dataService.getNotifications().subscribe(data => {
      this.notifications.set(data);
      this.loading.set(false);
    });
  }
}
