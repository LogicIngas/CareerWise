import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BackendNotification {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  getForUser(userId: string): Observable<BackendNotification[]> {
    return this.http.get<BackendNotification[]>(`${this.apiBaseUrl}/notifications/user/${userId}`);
  }

  markAsRead(notificationId: string): Observable<BackendNotification | null> {
    return this.http
      .put<BackendNotification | null>(`${this.apiBaseUrl}/notifications/${notificationId}/read`, {})
      .pipe(catchError(err => this.nullIfNotFound(err)));
  }

  markAllAsRead(userId: string): Observable<number> {
    return this.http.put<number>(`${this.apiBaseUrl}/notifications/user/${userId}/read-all`, {});
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
