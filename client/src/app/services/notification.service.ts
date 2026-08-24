import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.put<BackendNotification | null>(`${this.apiBaseUrl}/notifications/${notificationId}/read`, {});
  }

  markAllAsRead(userId: string): Observable<number> {
    return this.http.put<number>(`${this.apiBaseUrl}/notifications/user/${userId}/read-all`, {});
  }
}
