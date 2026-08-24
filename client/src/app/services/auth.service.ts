import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export type UserRole = 'candidate' | 'employer';

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  // Candidate-specific
  location?: string;
  currentTitle?: string;
  // Employer-specific
  companyName?: string;
  companySize?: string;
  industry?: string;
  companyRole?: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
  currentTitle?: string;
  companyName?: string;
  companySize?: string;
  industry?: string;
  // Captured in the UI but not sent to the backend: Employer has no matching
  // field (companyName/companyWebsite/companySize/industry/
  // companyDescription/companyHeadquarters — none fit "role at the company").
  companyRole?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface BackendUser {
  userId: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
}

interface BackendJobSeeker extends BackendUser {
  headline?: string;
  summary?: string;
  resume?: any;
  skills?: any[];
}

interface BackendEmployer extends BackendUser {
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  companyDescription?: string;
  companyHeadquarters?: string;
}

const STORAGE_KEY = 'careerwise_auth_user';

function fullName(firstName?: string, lastName?: string): string {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

function splitName(name: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = name.trim().split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  private userSignal = signal<AuthUser | null>(this.readStoredUser());

  currentUser = this.userSignal.asReadonly();
  isAuthenticated = computed(() => this.userSignal() !== null);
  role = computed(() => this.userSignal()?.role ?? null);

  signup(payload: SignupPayload): Observable<AuthUser> {
    const { firstName, lastName } = splitName(payload.name);

    if (payload.role === 'candidate') {
      const body = {
        email: payload.email,
        password: payload.password,
        firstName,
        lastName,
        location: payload.location || undefined,
        headline: payload.currentTitle || undefined
      };
      return this.http.post<BackendJobSeeker | null>(`${this.apiBaseUrl}/jobseekers/create`, body).pipe(
        switchMap(created => {
          if (!created) {
            return throwError(() => new Error('An account with this email already exists.'));
          }
          const user = this.mapJobSeeker(created);
          this.setUser(user);
          return of(user);
        }),
        catchError(err => throwError(() => this.normalizeError(err)))
      );
    }

    const body = {
      email: payload.email,
      password: payload.password,
      firstName,
      lastName,
      companyName: payload.companyName,
      companySize: payload.companySize || undefined,
      industry: payload.industry || undefined
    };
    return this.http.post<BackendEmployer | null>(`${this.apiBaseUrl}/employers/create`, body).pipe(
      switchMap(created => {
        if (!created) {
          return throwError(() => new Error('An account with this email already exists.'));
        }
        const user = this.mapEmployer(created);
        this.setUser(user);
        return of(user);
      }),
      catchError(err => throwError(() => this.normalizeError(err)))
    );
  }

  login(email: string, password: string): Observable<AuthUser> {
    const body: LoginPayload = { email, password };
    return this.http.post<BackendUser>(`${this.apiBaseUrl}/users/login`, body).pipe(
      switchMap(loggedInUser => this.resolveRole(loggedInUser)),
      map(user => {
        this.setUser(user);
        return user;
      }),
      catchError(err => throwError(() => this.normalizeError(err)))
    );
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  // The base /api/users/login response has no role field — role is implied
  // by which JOINED-inheritance subclass table the account lives in. Probe
  // both role-specific read endpoints to find which one has the account.
  private resolveRole(user: BackendUser): Observable<AuthUser> {
    return this.http.get<BackendJobSeeker | null>(`${this.apiBaseUrl}/jobseekers/read/${user.userId}`).pipe(
      switchMap(jobSeeker => {
        if (jobSeeker) {
          return of(this.mapJobSeeker(jobSeeker));
        }
        return this.http.get<BackendEmployer | null>(`${this.apiBaseUrl}/employers/read/${user.userId}`).pipe(
          map(employer => employer ? this.mapEmployer(employer) : this.mapJobSeeker(user))
        );
      })
    );
  }

  private mapJobSeeker(user: BackendJobSeeker): AuthUser {
    return {
      userId: user.userId,
      name: fullName(user.firstName, user.lastName),
      email: user.email,
      role: 'candidate',
      location: user.location || undefined,
      currentTitle: user.headline || undefined
    };
  }

  private mapEmployer(user: BackendEmployer): AuthUser {
    return {
      userId: user.userId,
      name: fullName(user.firstName, user.lastName),
      email: user.email,
      role: 'employer',
      companyName: user.companyName || undefined,
      companySize: user.companySize || undefined,
      industry: user.industry || undefined
    };
  }

  private normalizeError(err: any): Error {
    // 401 covers both "wrong password" and "unknown email" — always show the
    // same generic message so the API response doesn't reveal which emails
    // are registered, even though the backend uses distinct messages.
    if (err?.status === 401) {
      return new Error('Incorrect email or password.');
    }
    if (err?.status === 0) {
      return new Error("Can't reach the server. Please try again.");
    }
    return new Error(err?.error?.message ?? 'Something went wrong. Please try again.');
  }

  // NEW: changePassword
  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    const user = this.currentUser();
    if (!user) return throwError(() => new Error('Not logged in'));

    return this.http.post<boolean>(`${this.apiBaseUrl}/users/change-password`, {
      userId: user.userId,
      oldPassword,
      newPassword
    }).pipe(
      catchError(err => throwError(() => new Error(err?.error?.message || 'Incorrect current password')))
    );
  }

  refreshUser(partial: Partial<AuthUser>): void {
    const current = this.userSignal();
    if (!current) return;
    const updated = { ...current, ...partial };
    this.setUser(updated);
  }

  private setUser(user: AuthUser): void {
    this.userSignal.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private readStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
