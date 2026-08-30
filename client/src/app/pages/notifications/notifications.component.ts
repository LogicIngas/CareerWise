import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  NotificationService,
  BackendNotification
} from '../../services/notification.service';

import {
  AuthService
} from '../../services/auth.service';

import {
  Router
} from '@angular/router';


function timeAgo(iso: string): string {

  const diffMs =
    Date.now() -
    new Date(iso).getTime();

  const diffMin =
    Math.floor(
      diffMs / (1000 * 60)
    );

  if (diffMin < 1) {
    return 'Just now';
  }

  if (diffMin < 60) {
    return `${diffMin} min ago`;
  }

  const diffHours =
    Math.floor(diffMin / 60);

  if (diffHours < 24) {

    return `${diffHours} hour${
      diffHours > 1 ? 's' : ''
    } ago`;

  }

  const diffDays =
    Math.floor(diffHours / 24);

  if (diffDays === 1) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return new Date(iso)
    .toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric'
      }
    );

}


@Component({

  selector: 'app-notifications',

  standalone: true,

  imports: [
    CommonModule
  ],

  template: `

    <div
      class="p-8
  max-w-4xl
  mx-auto">

      <!-- HEADER -->

      <div
        class="flex
    justify-between
    items-center
    mb-8">

        <div>

          <h1
            class="text-2xl
        font-bold
        text-stone-900">

            Notifications

          </h1>

          <p
            class="text-stone-500
        mt-1">

            Stay up to date with your job search

          </p>

        </div>

        <button

          (click)="markAllRead()"

          [disabled]="!hasUnread()"

          class="border
      border-stone-200
      hover:bg-stone-50
      active:scale-[0.98]
      disabled:opacity-40
      disabled:cursor-not-allowed
      text-stone-700
      px-4
      py-2
      rounded-xl
      text-sm
      font-semibold
      transition-all
      shadow-sm">

          Mark all read

        </button>

      </div>


      <!-- NOTIFICATIONS -->

      <div
        class="bg-white
    rounded-2xl
    shadow-sm
    border
    border-stone-100
    overflow-hidden">

        <div
          class="divide-y
      divide-stone-50">

          <div

            *ngFor="let notif of notifications()"

            (click)="onNotificationClick(notif)"

            class="p-6
        flex
        items-start
        gap-4
        hover:bg-stone-50/50
        transition-colors
        cursor-pointer"

            [class.bg-brand-50]="!notif.read">


            <!-- ICON -->

            <div
              class="w-10
          h-10
          rounded-xl
          flex
          items-center
          justify-center
          flex-shrink-0"

              [ngClass]="{

            'bg-brand-50 text-brand-600':
              notif.type === 'APPLICATION_STATUS',

            'bg-purple-50 text-purple-600':
              notif.type === 'NEW_APPLICANT',

            'bg-blue-50 text-blue-600':
              notif.type === 'PROFILE_VIEW',

            'bg-green-50 text-green-600':
              notif.type === 'NEW_JOB'

          }">


              <ng-container
                [ngSwitch]="notif.type">


                <!-- APPLICATION STATUS -->

                <svg
                  *ngSwitchCase="'APPLICATION_STATUS'"

                  xmlns="http://www.w3.org/2000/svg"

                  width="20"
                  height="20"

                  viewBox="0 0 24 24"

                  fill="none"

                  stroke="currentColor"

                  stroke-width="2"

                  stroke-linecap="round"

                  stroke-linejoin="round">

                  <path
                    d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>

                  <path
                    d="m9 11 3 3L22 4"/>

                </svg>


                <!-- NEW APPLICANT -->

                <svg
                  *ngSwitchCase="'NEW_APPLICANT'"

                  xmlns="http://www.w3.org/2000/svg"

                  width="20"
                  height="20"

                  viewBox="0 0 24 24"

                  fill="none"

                  stroke="currentColor"

                  stroke-width="2"

                  stroke-linecap="round"

                  stroke-linejoin="round">

                  <rect
                    width="20"
                    height="14"
                    x="2"
                    y="7"
                    rx="2"
                    ry="2"/>

                  <path
                    d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>

                </svg>


                <!-- PROFILE VIEW -->

                <svg
                  *ngSwitchCase="'PROFILE_VIEW'"

                  xmlns="http://www.w3.org/2000/svg"

                  width="20"
                  height="20"

                  viewBox="0 0 24 24"

                  fill="none"

                  stroke="currentColor"

                  stroke-width="2"

                  stroke-linecap="round"

                  stroke-linejoin="round">

                  <path
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>

                  <circle
                    cx="12"
                    cy="12"
                    r="3"/>

                </svg>


                <!-- NEW JOB -->

                <svg
                  *ngSwitchCase="'NEW_JOB'"

                  xmlns="http://www.w3.org/2000/svg"

                  width="20"
                  height="20"

                  viewBox="0 0 24 24"

                  fill="none"

                  stroke="currentColor"

                  stroke-width="2"

                  stroke-linecap="round"

                  stroke-linejoin="round">

                  <rect
                    width="20"
                    height="14"
                    x="2"
                    y="7"
                    rx="2"
                    ry="2"/>

                  <path
                    d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>

                </svg>

              </ng-container>

            </div>


            <!-- CONTENT -->

            <div
              class="flex-grow">

              <div
                class="flex
            justify-between
            items-start">

                <h3
                  class="font-bold
              text-stone-900
              text-sm
              mb-1">

                  {{ notif.title }}

                </h3>

                <div
                  *ngIf="!notif.read"

                  class="w-2
              h-2
              rounded-full
              bg-brand-600
              mt-1.5
              flex-shrink-0">

                </div>

              </div>

              <p
                class="text-sm
            text-stone-600
            mb-1.5">

                {{ notif.message }}

              </p>

              <p
                class="text-xs
            text-stone-400
            font-medium">

                {{ timeAgo(notif.createdAt) }}

              </p>

            </div>

          </div>


          <!-- LOADING -->

          <div
            *ngIf="loading()"

            class="p-8
        text-center
        text-stone-500
        animate-pulse">

            Loading notifications...

          </div>


          <!-- EMPTY -->

          <div
            *ngIf="
          !loading() &&
          notifications().length === 0
        "

            class="p-12
        text-center">

            <p
              class="text-stone-900
          font-semibold
          mb-1">

              No notifications yet

            </p>

            <p
              class="text-stone-500
          text-sm">

              Activity on your applications
              and profile will show up here.

            </p>

          </div>

        </div>

      </div>


      <!-- BOTTOM -->

      <div

        *ngIf="
      !loading() &&
      notifications().length > 0
    "

        class="mt-8
    flex
    justify-center
    items-center
    text-sm
    font-medium
    text-stone-400
    gap-2">


        <svg
          xmlns="http://www.w3.org/2000/svg"

          width="16"
          height="16"

          viewBox="0 0 24 24"

          fill="none"

          stroke="currentColor"

          stroke-width="2"

          stroke-linecap="round"

          stroke-linejoin="round">

          <path
            d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>

          <path
            d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>

        </svg>


        You're all caught up

      </div>

    </div>

  `

})
export class NotificationsComponent
  implements OnInit {


  private notificationService =
    inject(NotificationService);


  private auth =
    inject(AuthService);


  private router =
    inject(Router);


  notifications =
    signal<BackendNotification[]>([]);


  loading =
    signal(true);


  hasUnread =
    computed(() =>
      this.notifications()
        .some(n => !n.read)
    );


  timeAgo =
    timeAgo;


  ngOnInit(): void {

    const userId =
      this.auth.currentUser()?.userId;


    if (!userId) {

      this.loading.set(false);

      return;

    }


    this.notificationService
      .getForUser(userId)
      .subscribe({

        next: (data) => {

          this.notifications.set(data);


          /*
           * We are now inside the Notifications page.
           *
           * Remove the red dot from the sidebar.
           */

          this.notificationService
            .clearUnread();


          this.loading.set(false);

        },


        error: (error) => {

          console.error(
            'Failed to load notifications:',
            error
          );


          this.loading.set(false);

        }

      });

  }


  onNotificationClick(
    notif: BackendNotification
  ): void {


    /*
     * Mark the notification as read.
     */

    if (!notif.read) {

      this.notificationService
        .markAsRead(
          notif.notificationId
        )
        .subscribe({

          next: () => {

            this.notifications.update(
              list =>
                list.map(n =>
                  n.notificationId ===
                  notif.notificationId

                    ? {
                      ...n,
                      read: true
                    }

                    : n
                )
            );


            /*
             * Update sidebar dot.
             */

            this.notificationService
              .updateUnreadStatus(
                this.notifications()
              );

          },


          error: (error) => {

            console.error(
              'Failed to mark notification as read:',
              error
            );

          }

        });

    }


    /*
     * ==========================================
     * NEW APPLICANT
     * ==========================================
     *
     * When an employer clicks a NEW_APPLICANT
     * notification, take them directly to the
     * applicants page for that specific job.
     *
     * Example:
     *
     * /employer-applicants/15
     *
     */

    if (
      notif.type === 'NEW_APPLICANT' &&
      notif.jobId
    ) {

      this.router.navigate([
        '/employer-applicants',
        notif.jobId
      ]);

      return;

    }


    /*
     * ==========================================
     * OTHER JOB NOTIFICATIONS
     * ==========================================
     *
     * Keep the existing candidate behavior.
     */

    if (notif.jobId) {

      this.router.navigate([
        '/jobs',
        notif.jobId
      ]);

    }

  }


  markRead(
    notif: BackendNotification
  ): void {


    if (notif.read) {

      return;

    }


    this.notificationService
      .markAsRead(
        notif.notificationId
      )
      .subscribe({

        next: () => {

          this.notifications.update(
            list =>
              list.map(n =>
                n.notificationId ===
                notif.notificationId

                  ? {
                    ...n,
                    read: true
                  }

                  : n
              )
          );


          this.notificationService
            .updateUnreadStatus(
              this.notifications()
            );

        },


        error: (error) => {

          console.error(
            'Failed to mark notification as read:',
            error
          );

        }

      });

  }


  markAllRead(): void {

    const userId =
      this.auth.currentUser()?.userId;


    if (!userId) {

      return;

    }


    this.notificationService
      .markAllAsRead(userId)
      .subscribe({

        next: () => {

          this.notifications.update(
            list =>
              list.map(n => ({
                ...n,
                read: true
              }))
          );


          /*
           * Remove red dot.
           */

          this.notificationService
            .clearUnread();

        },


        error: (error) => {

          console.error(
            'Failed to mark all notifications as read:',
            error
          );

        }

      });

  }

}
