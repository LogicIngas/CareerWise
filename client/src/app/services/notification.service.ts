
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, interval } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BackendNotification {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  jobId?: string;
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);

  private apiBaseUrl = environment.apiBaseUrl;

  private unreadSubject =
    new BehaviorSubject<boolean>(false);

  unread$ =
    this.unreadSubject.asObservable();

  getForUser(
    userId: string
  ): Observable<BackendNotification[]> {

    return this.http.get<BackendNotification[]>(
      `${this.apiBaseUrl}/notifications/user/${userId}`
    );

  }


  checkUnread(userId: string): void {

    this.getForUser(userId).subscribe({

      next: (notifications) => {

        const hasUnread =
          notifications.some(
            notification => !notification.read
          );

        this.unreadSubject.next(hasUnread);

      },

      error: (error) => {

        console.error(
          'Failed to check unread notifications:',
          error
        );

      }

    });

  }


  startPolling(
    userId: string
  ): Observable<BackendNotification[]> {

    return interval(5000).pipe(

      switchMap(() =>
        this.getForUser(userId)
      ),

      catchError(error => {

        console.error(
          'Notification polling failed:',
          error
        );

        return of([]);

      })

    );

  }

  updateUnreadStatus(
    notifications: BackendNotification[]
  ): void {

    const hasUnread =
      notifications.some(
        notification => !notification.read
      );

    this.unreadSubject.next(hasUnread);

  }



  clearUnread(): void {

    this.unreadSubject.next(false);

  }

  markAsRead(
    notificationId: string
  ): Observable<BackendNotification | null> {

    return this.http
      .put<BackendNotification | null>(
        `${this.apiBaseUrl}/notifications/${notificationId}/read`,
        {}
      );
  }



markAllAsRead(
    userId: string
): Observable<number> {

  return this.http.put<number>(
      `${this.apiBaseUrl}/notifications/user/${userId}/read-all`,
      {}
  );

}

}
