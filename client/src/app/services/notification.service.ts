
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject, interval } from 'rxjs';
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


  /*
   * Shared unread notification state.
   *
   * The Sidebar listens to this value.
   *
   * false = no red dot
   * true  = show red dot
   */
  private unreadSubject =
    new BehaviorSubject<boolean>(false);

  unread$ =
    this.unreadSubject.asObservable();


  /**
   * Get all notifications belonging to a user.
   */
  getForUser(
    userId: string
  ): Observable<BackendNotification[]> {

    return this.http.get<BackendNotification[]>(
      `${this.apiBaseUrl}/notifications/user/${userId}`
    );

  }


  /**
   * Check whether the user has unread notifications.
   *
   * This is used when the application starts.
   */
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


  /**
   * Poll the backend for new notifications.
   *
   * The sidebar uses this every 5 seconds.
   */
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


  /**
   * Update the shared unread state.
   */
  updateUnreadStatus(
    notifications: BackendNotification[]
  ): void {

    const hasUnread =
      notifications.some(
        notification => !notification.read
      );

    this.unreadSubject.next(hasUnread);

  }


  /**
   * Remove the red dot.
   */
  clearUnread(): void {

    this.unreadSubject.next(false);

  }


  /**
   * Mark one notification as read.
   */
  markAsRead(
    notificationId: string
  ): Observable<BackendNotification | null> {

    return this.http
      .put<BackendNotification | null>(
        `${this.apiBaseUrl}/notifications/${notificationId}/read`,
{}
)
.pipe(
    catchError(
        err => this.nullIfNotFound(err)
    )
);

}


/**
 * Mark all notifications as read.
 */
markAllAsRead(
    userId: string
): Observable<number> {

  return this.http.put<number>(
      `${this.apiBaseUrl}/notifications/user/${userId}/read-all`,
      {}
  );

}


/**
 * Convert a 404 response into null.
 */
private nullIfNotFound(
    err: HttpErrorResponse
): Observable<never> | Observable<null> {

  if (err.status === 404) {

  return of(null);

}

return throwError(() => err);

}

}
