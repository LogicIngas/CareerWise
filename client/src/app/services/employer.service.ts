import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  companyLogo?: string;
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
    return this.http.get<BackendEmployerFull | null>(`${this.apiBaseUrl}/employers/read/${userId}`);
  }
}
