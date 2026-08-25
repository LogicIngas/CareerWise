import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BackendSkill {
  skillId?: string;
  name: string;
  category?: string;
  yearsOfExperience?: number;
}

export interface BackendEducation {
  educationId?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface BackendExperience {
  experienceId?: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface BackendJobSeekerFull {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
  headline?: string;
  summary?: string;
  resume?: {
    resumeId?: string;
    fileName: string;
    storedName: string;
    contentType: string;
    fileSize: number;
  };
  profileViews?: number;
  skills: BackendSkill[];
  educations: BackendEducation[];
  experiences: BackendExperience[];
}

@Injectable({
  providedIn: 'root'
})
export class JobSeekerService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  getById(userId: string): Observable<BackendJobSeekerFull | null> {
    return this.http
      .get<BackendJobSeekerFull | null>(`${this.apiBaseUrl}/jobseekers/read/${userId}`)
      .pipe(catchError(err => this.nullIfNotFound(err)));
  }

  // NEW: updateProfile
  updateProfile(payload: Partial<BackendJobSeekerFull>): Observable<BackendJobSeekerFull | null> {
    return this.http
      .put<BackendJobSeekerFull | null>(`${this.apiBaseUrl}/jobseekers/profile`, payload)
      .pipe(catchError(err => this.nullIfNotFound(err)));
  }

  uploadResume(userId: string, file: File): Observable<BackendJobSeekerFull | null> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<BackendJobSeekerFull | null>(`${this.apiBaseUrl}/jobseekers/${userId}/resume`, formData)
      .pipe(catchError(err => this.nullIfNotFound(err)));
  }

  deleteResume(userId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiBaseUrl}/jobseekers/${userId}/resume`);
  }

  getResumeUrl(userId: string): string {
    return `${this.apiBaseUrl}/jobseekers/${userId}/resume`;
  }

  incrementProfileViews(userId: string, viewerCompany?: string): Observable<BackendJobSeekerFull | null> {
    const params: Record<string, string> = viewerCompany ? { viewerCompany } : {};
    return this.http
      .post<BackendJobSeekerFull | null>(`${this.apiBaseUrl}/jobseekers/${userId}/view`, {}, { params })
      .pipe(catchError(err => this.nullIfNotFound(err)));
  }

  // The backend now returns 404 instead of a null body; keep the old
  // "null = not found" contract for callers.
  private nullIfNotFound(err: HttpErrorResponse): Observable<never> | Observable<null> {
    if (err.status === 404) {
      return of(null);
    }
    return throwError(() => err);
  }
}
