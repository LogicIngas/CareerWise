import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Application } from '../models/models';
import { BackendJob } from './job.service';

export interface BackendApplication {
  applicationId: string;
  jobSeeker?: { userId: string; firstName?: string; lastName?: string; email?: string };
  job: BackendJob;
  status: string;
  appliedDate: string;
  notes?: string;
}

function formatDate(iso?: string): string {
  if (!iso) return 'Recently';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiBaseUrl = environment.apiBaseUrl;

  private applicationsSignal = signal<Application[]>([]);
  private appliedJobIdsSignal = signal<Set<string>>(new Set());
  private loadingSignal = signal<boolean>(false);

  applications = this.applicationsSignal.asReadonly();
  appliedJobIds = this.appliedJobIdsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor() {
    const user = this.auth.currentUser();
    if (user && user.role === 'candidate') {
      this.getApplicationsByJobSeeker(user.userId).subscribe();
    }
  }

  hasApplied(jobId: string): boolean {
    return this.appliedJobIdsSignal().has(jobId);
  }

  getApplicationsByJobSeeker(jobSeekerId?: string): Observable<Application[]> {
    const userId = jobSeekerId || this.auth.currentUser()?.userId;
    if (!userId) {
      this.applicationsSignal.set([]);
      this.appliedJobIdsSignal.set(new Set());
      return of([]);
    }

    this.loadingSignal.set(true);
    return this.http.get<BackendApplication[]>(`${this.apiBaseUrl}/applications/jobseeker/${userId}`).pipe(
      map(backendApps => {
        const apps = backendApps.map(item => this.mapApplication(item));
        this.applicationsSignal.set(apps);
        this.appliedJobIdsSignal.set(new Set(apps.map(a => a.jobId!).filter(Boolean)));
        this.loadingSignal.set(false);
        return apps;
      }),
      catchError(err => {
        console.error('Failed to load applications', err);
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  getApplicationsByJob(jobId: string): Observable<Application[]> {
    return this.http.get<BackendApplication[]>(`${this.apiBaseUrl}/applications/job/${jobId}`).pipe(
      map(backendApps => backendApps.map(item => this.mapApplication(item))),
      catchError(err => {
        console.error('Failed to load applicants', err);
        return of([]);
      })
    );
  }

  apply(jobId: string, notes: string = ''): Observable<Application | null> {
    const user = this.auth.currentUser();
    if (!user || user.role !== 'candidate') {
      return of(null);
    }

    return this.http.post<BackendApplication>(`${this.apiBaseUrl}/applications/apply`, {
      jobSeekerId: user.userId,
      jobId,
      notes
    }).pipe(
      map(backendApp => {
        const app = this.mapApplication(backendApp);
        const current = this.applicationsSignal();
        this.applicationsSignal.set([app, ...current.filter(a => a.id !== app.id)]);

        const set = new Set(this.appliedJobIdsSignal());
        set.add(jobId);
        this.appliedJobIdsSignal.set(set);

        return app;
      }),
      catchError(err => {
        console.error('Failed to submit application', err);
        return of(null);
      })
    );
  }

  private mapApplication(b: BackendApplication): Application {
    return {
      id: b.applicationId,
      jobId: b.job?.jobId,
      jobTitle: b.job?.title || 'Unknown Position',
      company: b.job?.employer?.companyName || 'Unknown Company',
      status: b.status || 'Applied',
      dateApplied: formatDate(b.appliedDate),
      location: b.job?.location,
      salaryRange: b.job?.salaryRange,
      notes: b.notes,
      jobSeekerId: b.jobSeeker?.userId,
      applicantName: [b.jobSeeker?.firstName, b.jobSeeker?.lastName].filter(Boolean).join(' ').trim() || 'Applicant',
      applicantEmail: b.jobSeeker?.email
    };
  }
}
