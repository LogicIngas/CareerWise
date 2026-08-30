
import {
  Component,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

import {
  NotificationService
} from '../../services/notification.service';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sidebar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  template: `

<aside
class="w-64
bg-white
border-r
border-stone-100
h-screen
sticky
top-0
flex
flex-col
pt-6
pb-4">


<!-- LOGO -->

<div class="px-6 mb-8">

<a
  routerLink="/"
class="flex items-center gap-2">

<div
  class="bg-brand-600
text-white
p-1.5
rounded-lg">

<svg
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
  width="16"
height="16"
x="4"
y="4"
rx="2" />

<rect
  width="6"
height="6"
x="9"
y="9"
rx="1" />

<path d="M9 15v2" />

<path d="M15 15v2" />

  </svg>

  </div>

  <span
class="text-xl
font-bold
text-stone-900
tracking-tight">

CareerWise

</span>

</a>

</div>



<!-- NAVIGATION -->

<div
class="flex-grow
overflow-y-auto
px-4
custom-scrollbar">


<!-- ================= CANDIDATE ================= -->

<div
  class="mb-6"
*ngIf="auth.role() === 'candidate'">

<h4
  class="text-xs
font-bold
text-stone-400
uppercase
tracking-wider
px-2
mb-2">

Candidate

</h4>


<nav class="space-y-1">


<!-- Dashboard -->

<a
  routerLink="/dashboard"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

  [routerLinkActiveOptions]="{exact: true}"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Dashboard Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<rect width="7" height="9" x="3" y="3" rx="1"/>
<rect width="7" height="5" x="14" y="3" rx="1"/>
<rect width="7" height="9" x="14" y="12" rx="1"/>
<rect width="7" height="5" x="3" y="16" rx="1"/>

  </svg>

Dashboard

</a>


<!-- Find Jobs -->

<a
routerLink="/jobs"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Search Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<circle cx="11" cy="11" r="8"/>
<path d="m21 21-4.3-4.3"/>

  </svg>

Find Jobs

</a>


<!-- Saved Jobs -->

<a
routerLink="/saved-jobs"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Bookmark Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>

  </svg>

Saved Jobs

</a>


<!-- Applications -->

<a
routerLink="/applications"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Applications Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>

<polyline points="14 2 14 8 20 8"/>

<line x1="16" x2="8" y1="13" y2="13"/>

<line x1="16" x2="8" y1="17" y2="17"/>

<line x1="10" x2="8" y1="9" y2="9"/>

  </svg>

Applications

</a>


<!-- ================= MESSAGES ================= -->

<a
routerLink="/messages"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Message Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8
8.5 8.5 0 0 1-7.6 4.7
8.38 8.38 0 0 1-3.8-.9
L3 21l1.9-5.7
a8.38 8.38 0 0 1-.9-3.8
8.5 8.5 0 0 1 4.7-7.6
8.38 8.38 0 0 1 3.8-.9h.5
a8.48 8.48 0 0 1 8 8v.5z"/>

</svg>

Messages

</a>


<!-- ================= NOTIFICATIONS ================= -->

<a
routerLink="/notifications"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">


<!-- Bell -->

<span class="relative flex-shrink-0">

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
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


<!-- RED DOT -->

<span
*ngIf="hasNewNotifications"

class="absolute
  -top-1
  -right-1
w-2.5
h-2.5
bg-red-500
rounded-full
border-2
border-white">

</span>

</span>


Notifications

</a>


<!-- Profile -->

<a
routerLink="/profile"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Profile Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>

<circle cx="12" cy="7" r="4"/>

  </svg>

Profile

</a>

</nav>

</div>



<!-- ================= EMPLOYER ================= -->

<div
class="mb-6"
*ngIf="auth.role() === 'employer'">

<h4
  class="text-xs
font-bold
text-stone-400
uppercase
tracking-wider
px-2
mb-2">

Employer

</h4>


<nav class="space-y-1">


  <!-- Employer Home -->

<a
  routerLink="/employer-home"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Company Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<rect width="16" height="20" x="4" y="2" rx="2"/>

<path d="M9 22v-4h6v4"/>

<path d="M8 6h.01"/>
<path d="M16 6h.01"/>
<path d="M12 6h.01"/>
<path d="M12 10h.01"/>
<path d="M12 14h.01"/>
<path d="M16 10h.01"/>
<path d="M16 14h.01"/>
<path d="M8 10h.01"/>
<path d="M8 14h.01"/>

  </svg>

Employer Home

</a>


<!-- Post Job -->

<a
routerLink="/post-job"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Plus Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<circle cx="12" cy="12" r="10"/>

<line x1="12" x2="12" y1="8" y2="16"/>

<line x1="8" x2="16" y1="12" y2="12"/>

  </svg>

Post a Job

</a>


<!-- Company Profile -->

<a
routerLink="/employer-profile"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Location Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>

<circle cx="12" cy="10" r="3"/>

  </svg>

Company Profile

</a>


<!-- ================= MESSAGES ================= -->

<a
routerLink="/messages"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Message Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8
8.5 8.5 0 0 1-7.6 4.7
8.38 8.38 0 0 1-3.8-.9
L3 21l1.9-5.7
a8.38 8.38 0 0 1-.9-3.8
8.5 8.5 0 0 1 4.7-7.6
8.38 8.38 0 0 1 3.8-.9h.5
a8.48 8.48 0 0 1 8 8v.5z"/>

</svg>

Messages

</a>


<!-- Notifications -->

<a
routerLink="/notifications"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">


<span class="relative flex-shrink-0">

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
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


<!-- RED DOT -->

<span
*ngIf="hasNewNotifications"

class="absolute
  -top-1
  -right-1
w-2.5
h-2.5
bg-red-500
rounded-full
border-2
border-white">

</span>

</span>


Notifications

</a>

</nav>

</div>

</div>



<!-- ================= ACCOUNT ================= -->

<div class="px-4 mt-auto">

<h4
  class="text-xs
font-bold
text-stone-400
uppercase
tracking-wider
px-2
mb-2">

Account

</h4>


<nav class="space-y-1 mb-2">

<a
  routerLink="/settings"

routerLinkActive="bg-brand-50 text-brand-800 font-semibold shadow-[inset_2px_0_0_0_var(--color-brand-600)]"

class="flex
items-center
gap-3
pl-3
pr-3
py-2.5
rounded-r-lg
text-stone-600
hover:bg-stone-50
hover:translate-x-0.5
transition-all
text-sm">

<!-- Settings Icon -->

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>

<circle
  cx="12"
cy="12"
r="3"/>

  </svg>

Settings

</a>

</nav>


<!-- USER -->

<a
routerLink="/profile"

class="w-full
flex
items-center
gap-3
p-3
rounded-xl
hover:bg-stone-50
transition-colors
border
border-transparent
hover:border-stone-100">


<div
class="w-9
h-9
rounded-lg
bg-brand-600
text-white
flex
items-center
justify-center
font-bold
text-sm
flex-shrink-0">

{{ initials() }}

</div>


<div
class="text-left
min-w-0">

<p
class="text-sm
font-semibold
text-stone-900
leading-none
mb-1
truncate">

{{ auth.currentUser()?.name || 'Account' }}

</p>


<p
class="text-xs
text-stone-500
leading-none
truncate">

{{ auth.currentUser()?.email }}

</p>

</div>

</a>


<!-- LOGOUT -->

<button
(click)="logout()"

class="w-full
flex
items-center
gap-3
px-3
py-2.5
mt-1
rounded-xl
text-stone-500
hover:bg-stone-50
hover:text-red-600
transition-all
text-sm">

Log out

</button>

</div>

</aside>
  `
})
export class SidebarComponent
  implements OnInit, OnDestroy {


  protected auth =
    inject(AuthService);


  private router =
    inject(Router);


  private notificationService =
    inject(NotificationService);


  private notificationSubscription?:
    Subscription;


  /*
   * Controls the red notification dot.
   */
  hasNewNotifications =
    false;


  ngOnInit(): void {

    const userId =
      this.auth.currentUser()?.userId;


    if (!userId) {

      return;

    }


    /*
     * Check immediately when the sidebar loads.
     */
    this.notificationService
      .checkUnread(userId);


    /*
     * Listen for unread status changes.
     */
    this.notificationSubscription =
      this.notificationService.unread$
        .subscribe(hasUnread => {

          this.hasNewNotifications =
            hasUnread;

        });


    /*
     * Check the backend every 5 seconds.
     */
    this.notificationService
      .startPolling(userId)
      .subscribe(notifications => {

        this.notificationService
          .updateUnreadStatus(notifications);

      });

  }


  ngOnDestroy(): void {

    this.notificationSubscription
      ?.unsubscribe();

  }


  initials(): string {

    const name =
      this.auth.currentUser()?.name ?? '';


    const parts =
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean);


    if (parts.length === 0) {

      return '?';

    }


    return parts.length === 1

      ? parts[0]
          .slice(0, 2)
          .toUpperCase()

      : (
          parts[0][0] +
          parts[parts.length - 1][0]
        ).toUpperCase();

  }


  logout(): void {

    this.auth.logout();

    this.router.navigate(['/']);

  }

}
