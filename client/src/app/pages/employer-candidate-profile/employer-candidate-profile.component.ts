import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobSeekerService, BackendJobSeekerFull } from '../../services/job-seeker.service';

@Component({
  selector: 'app-employer-candidate-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 max-w-4xl mx-auto pb-20">
      <a routerLink="/employer-home" class="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-700 transition-colors mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to dashboard
      </a>

      <div *ngIf="candidate() as c" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 flex flex-col items-center text-center sticky top-24">
            <div class="w-24 h-24 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md shadow-brand-900/10">
              {{ initials(c) }}
            </div>
            <h2 class="text-xl font-bold text-stone-900 mb-1">{{ c.firstName }} {{ c.lastName }}</h2>
            <p class="text-stone-500 text-sm mb-6">{{ c.headline || 'Jobseeker' }}</p>

            <div class="w-full space-y-3 text-sm text-stone-600 mb-6 text-left">
              <div class="flex items-center gap-3">
                <svg class="text-stone-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span class="truncate">{{ c.email }}</span>
              </div>
              <div class="flex items-center gap-3" *ngIf="c.phoneNumber">
                <svg class="text-stone-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span class="truncate">{{ c.phoneNumber }}</span>
              </div>
              <div class="flex items-center gap-3" *ngIf="c.location">
                <svg class="text-stone-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="truncate">{{ c.location }}</span>
              </div>
            </div>

            <a *ngIf="c.resumePath" [href]="resumeUrl(c.userId)" target="_blank" rel="noopener"
              class="block w-full text-center py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm">
              View Resume
            </a>
          </div>
        </div>

        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8" *ngIf="c.summary">
            <h2 class="text-lg font-bold text-stone-900 mb-3">About</h2>
            <p class="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{{ c.summary }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 class="text-lg font-bold text-stone-900 mb-4">Skills</h2>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let skill of c.skills" class="inline-flex items-center px-3 py-1.5 bg-brand-50 text-brand-700 text-xs font-semibold rounded-lg border border-brand-200/60">
                {{ skill.name }}
              </span>
              <p *ngIf="c.skills.length === 0" class="text-sm text-stone-400">No skills listed.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 class="text-lg font-bold text-stone-900 mb-4">Education</h2>
            <div class="space-y-4">
              <div *ngFor="let edu of c.educations" class="p-4 rounded-xl border border-stone-100 bg-stone-50/40">
                <h3 class="font-bold text-stone-900 text-sm">{{ edu.degree }} <span *ngIf="edu.fieldOfStudy" class="font-normal text-stone-600">in {{ edu.fieldOfStudy }}</span></h3>
                <p class="text-xs text-stone-600 mt-0.5">{{ edu.institution }}</p>
                <p class="text-xs text-stone-400 mt-1" *ngIf="edu.description || edu.startDate">{{ edu.description || edu.startDate }}</p>
              </div>
              <p *ngIf="c.educations.length === 0" class="text-sm text-stone-400">No education listed.</p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="loading()" class="py-16 text-center text-stone-500 animate-pulse">
        Loading candidate profile...
      </div>

      <div *ngIf="!loading() && !candidate()" class="py-16 text-center">
        <p class="text-stone-900 font-semibold mb-1">Candidate not found</p>
      </div>
    </div>
  `
})
export class EmployerCandidateProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobSeekerService = inject(JobSeekerService);

  candidate = signal<BackendJobSeekerFull | null>(null);
  loading = signal(true);

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (!userId) {
      this.loading.set(false);
      return;
    }

    this.jobSeekerService.getById(userId).subscribe(c => {
      this.candidate.set(c);
      this.loading.set(false);
    });

    // Fire-and-forget: records that an employer opened this candidate's profile.
    this.jobSeekerService.incrementProfileViews(userId).subscribe();
  }

  initials(c: BackendJobSeekerFull): string {
    return `${c.firstName?.[0] ?? ''}${c.lastName?.[0] ?? ''}`.toUpperCase() || 'U';
  }

  resumeUrl(userId: string): string {
    return this.jobSeekerService.getResumeUrl(userId);
  }
}
