import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

export interface BackendJobSeekerFull {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
  headline?: string;
  summary?: string;
  resumePath?: string;
  skills: BackendSkill[];
  educations: BackendEducation[];
}

@Injectable({
  providedIn: 'root'
})
export class JobSeekerService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  getById(userId: string): Observable<BackendJobSeekerFull | null> {
    return this.http.get<BackendJobSeekerFull | null>(`${this.apiBaseUrl}/jobseekers/read/${userId}`);
  }

  // NEW: updateProfile
  updateProfile(payload: Partial<BackendJobSeekerFull>): Observable<BackendJobSeekerFull | null> {
    return this.http.put<BackendJobSeekerFull | null>(`${this.apiBaseUrl}/jobseekers/profile`, payload);
  }
}
