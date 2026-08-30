
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  JobSeekerService,
  BackendJobSeekerFull
} from '../../services/job-seeker.service';

import { AuthService } from '../../services/auth.service';
import { SanitizeUrlPipe } from '../../pipes/sanitize-url.pipe';

@Component({
  selector: 'app-employer-candidate-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SanitizeUrlPipe
  ],
  template: `
<div class="p-8 max-w-4xl mx-auto pb-20">

<!-- Back -->
<a
  routerLink="/employer-home"
class="inline-flex items-center gap-1.5
text-sm font-semibold
text-stone-500
hover:text-stone-700
transition-colors
mb-6">

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

<path d="m15 18-6-6 6-6"/>

  </svg>

Back to dashboard

</a>


<!-- Candidate -->
<div
*ngIf="candidate() as c"
class="grid grid-cols-1 md:grid-cols-3 gap-8">


  <!-- ================= LEFT COLUMN ================= -->

<div class="md:col-span-1">

<div
  class="bg-white
rounded-2xl
shadow-sm
border border-stone-100
p-8
flex
flex-col
items-center
text-center
sticky
top-24">


<!-- Avatar -->
<div
  class="w-24 h-24
rounded-2xl
bg-brand-600
text-white
flex
items-center
justify-center
text-3xl
font-bold
mb-4
shadow-md
shadow-brand-900/10">

{{ initials(c) }}

</div>


<!-- Name -->
<h2
class="text-xl
font-bold
text-stone-900
mb-1">

{{ c.firstName }} {{ c.lastName }}

</h2>


<!-- Headline -->
<p
class="text-stone-500
text-sm
mb-6">

{{ c.headline || 'Jobseeker' }}

</p>


<!-- Contact information -->
<div
class="w-full
space-y-3
text-sm
text-stone-600
mb-6
text-left">


<!-- Email -->
<div class="flex items-center gap-3">

<svg
  class="text-stone-400 flex-shrink-0"
xmlns="http://www.w3.org/2000/svg"
width="16"
height="16"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2">

<rect
  width="20"
height="16"
x="2"
y="4"
rx="2"/>

<path
  d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>

  </svg>

  <span class="truncate">
  {{ c.email }}
</span>

</div>


<!-- Phone -->
<div
class="flex items-center gap-3"
*ngIf="c.phoneNumber">

<svg
  class="text-stone-400 flex-shrink-0"
xmlns="http://www.w3.org/2000/svg"
width="16"
height="16"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2">

<path
  d="M22 16.92v3a2 2 0 0 1-2.18 2
19.79 19.79 0 0 1-8.63-3.07
19.5 19.5 0 0 1-6-6
19.79 19.79 0 0 1-3.07-8.67
A2 2 0 0 1 4.11 2h3
a2 2 0 0 1 2 1.72
12.84 12.84 0 0 0 .7 2.81
2 2 0 0 1-.45 2.11L8.09 9.91
a16 16 0 0 0 6 6l1.27-1.27
a2 2 0 0 1 2.11-.45
12.84 12.84 0 0 0 2.81.7
A2 2 0 0 1 22 16.92z"/>

</svg>

<span class="truncate">
  {{ c.phoneNumber }}
</span>

</div>


<!-- Location -->
<div
class="flex items-center gap-3"
*ngIf="c.location">

<svg
  class="text-stone-400 flex-shrink-0"
xmlns="http://www.w3.org/2000/svg"
width="16"
height="16"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2">

<path
  d="M20 10c0 6-8 12-8 12
S4 16 4 10
a8 8 0 1 1 16 0Z"/>

<circle
cx="12"
cy="10"
r="3"/>

  </svg>

  <span class="truncate">
  {{ c.location }}
</span>

</div>

</div>


<!-- ================= MESSAGE BUTTON ================= -->

<button
type="button"
(click)="openMessages(c)"
class="w-full
py-2.5
px-4
bg-stone-900
hover:bg-stone-800
text-white
rounded-xl
text-sm
font-semibold
transition-all
shadow-sm
flex
items-center
justify-center
gap-2">

<svg
xmlns="http://www.w3.org/2000/svg"
width="17"
height="17"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="M21 15a4 4 0 0 1-4 4H8l-5 3V7
a4 4 0 0 1 4-4h10
a4 4 0 0 1 4 4z"/>

</svg>

Message Applicant

</button>


<!-- Resume button -->
<button
*ngIf="c.resume"
type="button"
(click)="showResumePreview.set(!showResumePreview())"
class="block
w-full
text-center
py-2.5
px-4
mt-3
bg-brand-600
hover:bg-brand-700
text-white
rounded-xl
text-sm
font-semibold
transition-all
shadow-sm">

{{ showResumePreview() ? 'Hide Resume' : 'View Resume' }}

</button>

</div>

</div>


<!-- ================= RIGHT COLUMN ================= -->

<div class="md:col-span-2 space-y-6">


<!-- About -->
<div
  class="bg-white
rounded-2xl
shadow-sm
border border-stone-100
p-8"
*ngIf="c.summary">

<h2
  class="text-lg
font-bold
text-stone-900
mb-3">

About

</h2>

<p
class="text-sm
text-stone-600
leading-relaxed
whitespace-pre-line">

{{ c.summary }}

</p>

</div>


<!-- Skills -->
<div
class="bg-white
rounded-2xl
shadow-sm
border border-stone-100
p-8">

<h2
class="text-lg
font-bold
text-stone-900
mb-4">

Skills

</h2>

<div class="flex flex-wrap gap-2">

<span
*ngFor="let skill of c.skills"
class="inline-flex
items-center
px-3
py-1.5
bg-brand-50
text-brand-700
text-xs
font-semibold
rounded-lg
border
border-brand-200/60">

{{ skill.name }}

</span>

<p
*ngIf="c.skills.length === 0"
class="text-sm text-stone-400">

  No skills listed.

</p>

</div>

</div>


<!-- Education -->
<div
class="bg-white
rounded-2xl
shadow-sm
border border-stone-100
p-8">

<h2
class="text-lg
font-bold
text-stone-900
mb-4">

Education

</h2>

<div class="space-y-4">

<div
*ngFor="let edu of c.educations"
class="p-4
rounded-xl
border border-stone-100
bg-stone-50/40">

<h3
class="font-bold
text-stone-900
text-sm">

{{ edu.degree }}

<span
*ngIf="edu.fieldOfStudy"
class="font-normal text-stone-600">

  in {{ edu.fieldOfStudy }}

</span>

</h3>

<p
class="text-xs
text-stone-600
mt-0.5">

{{ edu.institution }}

</p>

<p
class="text-xs
text-stone-400
mt-1"
*ngIf="edu.description || edu.startDate">

  {{ edu.description || edu.startDate }}

</p>

</div>

<p
*ngIf="c.educations.length === 0"
class="text-sm text-stone-400">

  No education listed.

</p>

</div>

</div>


<!-- Resume -->
<div
*ngIf="c.resume"
class="bg-white
rounded-2xl
shadow-sm
border border-stone-100
p-8">

<div
class="flex
items-center
justify-between
mb-4">

<div>

<h2
  class="text-lg
font-bold
text-stone-900">

Resume / CV

</h2>

<p
class="text-xs
text-stone-500
mt-0.5">

{{ c.resume?.fileName }}

</p>

</div>


<button
type="button"
(click)="showResumePreview.set(!showResumePreview())"
class="text-xs
font-semibold
text-brand-600
hover:text-brand-700
transition-colors
flex
items-center
gap-1">

<svg
xmlns="http://www.w3.org/2000/svg"
width="14"
height="14"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="M2 12s3-7 10-7
10 7 10 7-3 7-10 7
-10-7-10-7Z"/>

<circle
cx="12"
cy="12"
r="3"/>

  </svg>

{{ showResumePreview() ? 'Hide Preview' : 'Preview Resume' }}

</button>

</div>


<!-- Resume preview -->
<div
*ngIf="showResumePreview()"
class="rounded-xl
overflow-hidden
border border-stone-200">

<iframe
  [src]="resumeUrl(c.userId) | sanitizeUrl"
width="100%"
height="700"
class="block"
title="Candidate Resume">
</iframe>

</div>


<!-- Resume closed -->
<div
*ngIf="!showResumePreview()"
class="flex
items-center
gap-3
p-4
rounded-xl
bg-stone-50
border border-stone-200">

<div
class="w-10
h-10
rounded-lg
bg-brand-50
text-brand-600
flex
items-center
justify-center
flex-shrink-0">

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

<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>

<path d="M14 2v4a2 2 0 0 0 2 2h4"/>

  </svg>

  </div>

  <span
class="text-sm
font-semibold
text-stone-700">

{{ c.resume?.fileName }}

</span>

</div>

</div>

</div>

</div>


<!-- Loading -->
<div
*ngIf="loading()"
class="py-16
text-center
text-stone-500
animate-pulse">

Loading candidate profile...

</div>


<!-- Not found -->
<div
*ngIf="!loading() && !candidate()"
class="py-16 text-center">

<p
  class="text-stone-900
font-semibold
mb-1">

Candidate not found

</p>

</div>

</div>
  `
})
export class EmployerCandidateProfileComponent implements OnInit {

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private jobSeekerService = inject(JobSeekerService);

  private auth = inject(AuthService);


  candidate = signal<BackendJobSeekerFull | null>(null);

  loading = signal(true);

  showResumePreview = signal(false);


  ngOnInit(): void {

    const userId =
      this.route.snapshot.paramMap.get('userId');


    if (!userId) {

      this.loading.set(false);

      return;

    }


    this.jobSeekerService
      .getById(userId)
      .subscribe({

        next: (candidate) => {

          this.candidate.set(candidate);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Failed to load candidate profile:',
            error
          );

          this.loading.set(false);

        }

      });


    // Record profile view.
    const viewerCompany =
      this.auth.currentUser()?.companyName;


    this.jobSeekerService
      .incrementProfileViews(
        userId,
        viewerCompany
      )
      .subscribe();

  }


  /**
   * Open the Messages page for this applicant.
   */
  openMessages(candidate: BackendJobSeekerFull): void {

    const name =
      `${candidate.firstName ?? ''} ${candidate.lastName ?? ''}`
        .trim() || 'Applicant';


    const role =
      candidate.headline || 'Applicant';


    this.router.navigate(
      ['/messages'],
      {
        queryParams: {
          userId: candidate.userId,
          name,
          role
        }
      }
    );

  }


  initials(c: BackendJobSeekerFull): string {

    return `${c.firstName?.[0] ?? ''}${c.lastName?.[0] ?? ''}`
      .toUpperCase() || 'U';

  }


  resumeUrl(userId: string): string {

    return this.jobSeekerService
      .getResumeUrl(userId);

  }

}

