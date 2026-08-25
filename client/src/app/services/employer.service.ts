import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BackendJob } from './job.service';

export interface BackendEmployerFull {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  companyDescription?: string;
  companyHeadquarters?: string;
  postedJobs: BackendJob[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  getById(userId: string): Observable<BackendEmployerFull | null> {
    return this.http
      .get<BackendEmployerFull | null>(`${this.apiBaseUrl}/employers/read/${userId}`)
      .pipe(catchError(err => this.nullIfNotFound(err)));
  }

  update(employer: BackendEmployerFull): Observable<BackendEmployerFull | null> {
    return this.http
      .put<BackendEmployerFull | null>(`${this.apiBaseUrl}/employers/update`, employer)
      .pipe(catchError(err => this.nullIfNotFound(err)));
  }

  delete(userId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiBaseUrl}/employers/delete/${userId}`);
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
