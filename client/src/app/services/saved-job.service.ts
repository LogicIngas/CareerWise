import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Job } from '../models/models';
import { BackendJob, JobService } from './job.service';

export interface BackendSavedJob {
  savedJobId?: string;
  jobSeeker?: { userId: string };
  job: BackendJob;
  savedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SavedJobService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private jobService = inject(JobService);
  private apiBaseUrl = environment.apiBaseUrl;

  private savedJobIdsSignal = signal<Set<string>>(new Set());
  private savedJobsSignal = signal<Job[]>([]);
  private loadingSignal = signal<boolean>(false);

  savedJobIds = this.savedJobIdsSignal.asReadonly();
  savedJobs = this.savedJobsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor() {
    // Automatically load when authenticated as candidate
    const user = this.auth.currentUser();
    if (user && user.role === 'candidate') {
      this.loadSavedJobs(user.userId).subscribe();
    }
  }

  isSaved(jobId: string): boolean {
    return this.savedJobIdsSignal().has(jobId);
  }

  loadSavedJobs(jobSeekerId?: string): Observable<Job[]> {
    const userId = jobSeekerId || this.auth.currentUser()?.userId;
    if (!userId) {
      this.savedJobIdsSignal.set(new Set());
      this.savedJobsSignal.set([]);
      return of([]);
    }

    this.loadingSignal.set(true);
    return this.http.get<BackendSavedJob[]>(`${this.apiBaseUrl}/saved-jobs/jobseeker/${userId}`).pipe(
      map(savedItems => {
        const jobs = savedItems.map(item => this.mapBackendJob(item.job));
        const ids = new Set(jobs.map(j => j.id));
        this.savedJobIdsSignal.set(ids);
        this.savedJobsSignal.set(jobs);
        this.loadingSignal.set(false);
        return jobs;
      }),
      catchError(err => {
        console.error('Failed to load saved jobs', err);
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  toggleSave(job: Job): Observable<boolean> {
    const user = this.auth.currentUser();
    if (!user || user.role !== 'candidate') {
      return of(false);
    }

    const currentlySaved = this.isSaved(job.id);

    // Optimistic UI update
    const currentSet = new Set(this.savedJobIdsSignal());
    const currentList = [...this.savedJobsSignal()];

    if (currentlySaved) {
      currentSet.delete(job.id);
      this.savedJobIdsSignal.set(currentSet);
      this.savedJobsSignal.set(currentList.filter(j => j.id !== job.id));

      return this.http.delete<boolean>(`${this.apiBaseUrl}/saved-jobs/unsave`, {
        body: { jobSeekerId: user.userId, jobId: job.id }
      }).pipe(
        map(() => true),
        catchError(err => {
          console.error('Failed to unsave job', err);
          // Rollback
          currentSet.add(job.id);
          this.savedJobIdsSignal.set(currentSet);
          this.savedJobsSignal.set(currentList);
          return of(false);
        })
      );
    } else {
      currentSet.add(job.id);
      this.savedJobIdsSignal.set(currentSet);
      this.savedJobsSignal.set([job, ...currentList.filter(j => j.id !== job.id)]);

      return this.http.post<BackendSavedJob>(`${this.apiBaseUrl}/saved-jobs/save`, {
        jobSeekerId: user.userId,
        jobId: job.id
      }).pipe(
        map(() => true),
        catchError(err => {
          console.error('Failed to save job', err);
          // Rollback
          currentSet.delete(job.id);
          this.savedJobIdsSignal.set(currentSet);
          this.savedJobsSignal.set(currentList.filter(j => j.id !== job.id));
          return of(false);
        })
      );
    }
  }

  private mapBackendJob(b: BackendJob): Job {
    const company = b.employer?.companyName || 'Unknown Company';
    return {
      id: b.jobId!,
      title: b.title,
      company,
      companyInitial: company.charAt(0).toUpperCase(),
      companyColor: 'bg-brand-600',
      tags: (b.requirements ?? []).slice(0, 3),
      location: b.location,
      salaryRange: b.salaryRange,
      postedTime: 'Saved',
      type: b.employmentType as Job['type'],
      isRemote: b.remoteOption ?? false,
      isSaved: true
    };
  }
}
