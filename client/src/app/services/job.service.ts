import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Job } from '../models/models';

interface BackendEmployerRef {
  userId: string;
  companyName?: string;
}

export interface BackendJob {
  jobId?: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  remoteOption: boolean;
  salaryRange: string;
  employmentType: string;
  deadlineDate?: string;
  employer: BackendEmployerRef;
  status?: 'OPEN' | 'CLOSED' | 'FILLED' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
}

const COMPANY_COLORS = [
  'bg-slate-600', 'bg-blue-600', 'bg-rose-600',
  'bg-pink-600', 'bg-violet-600', 'bg-orange-600'
];

function companyColor(seed: string): string {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return COMPANY_COLORS[hash % COMPANY_COLORS.length];
}

function relativeTime(iso?: string): string {
  if (!iso) return 'Recently';
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  getOpenPositions(): Observable<Job[]> {
    return this.http.get<BackendJob[]>(`${this.apiBaseUrl}/jobs/findOpenPositions`).pipe(
      map(jobs => jobs.map(j => this.mapJob(j)))
    );
  }

  getById(id: string): Observable<Job | null> {
    return this.http.get<BackendJob | null>(`${this.apiBaseUrl}/jobs/read/${id}`).pipe(
      map(job => job ? this.mapJob(job) : null)
    );
  }

  create(payload: BackendJob): Observable<Job | null> {
    return this.http.post<BackendJob | null>(`${this.apiBaseUrl}/jobs/create`, payload).pipe(
      map(job => job ? this.mapJob(job) : null)
    );
  }

  private mapJob(b: BackendJob): Job {
    const company = b.employer?.companyName || 'Unknown Company';
    return {
      id: b.jobId!,
      title: b.title,
      company,
      companyInitial: company.charAt(0).toUpperCase(),
      companyColor: companyColor(b.employer?.userId ?? company),
      // Requirements are full sentences, not short tags — an imperfect stand-in
      // since Job has no dedicated skills/tags field on the backend.
      tags: (b.requirements ?? []).slice(0, 3),
      location: b.location,
      salaryRange: b.salaryRange,
      postedTime: relativeTime(b.createdAt),
      type: b.employmentType as Job['type'],
      isRemote: b.remoteOption ?? false
    };
  }
}
