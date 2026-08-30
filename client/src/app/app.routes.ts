
import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing/landing.component')
            .then(m => m.LandingComponent),
        title: 'CareerWise | Find the job that moves your career forward'
      }
    ]
  },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [

      // =========================
      // CANDIDATE
      // =========================

      {
        path: 'jobs',
        canActivate: [roleGuard('candidate')],
        loadComponent: () =>
          import('./pages/find-jobs/find-jobs.component')
            .then(m => m.FindJobsComponent),
        title: 'Find Jobs | CareerWise'
      },

      {
        path: 'jobs/:id',
        canActivate: [roleGuard('candidate')],
        loadComponent: () =>
          import('./pages/job-detail/job-detail.component')
            .then(m => m.JobDetailComponent),
        title: 'Job Details | CareerWise'
      },

      {
        path: 'dashboard',
        canActivate: [roleGuard('candidate')],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        title: 'Dashboard | CareerWise'
      },

      {
        path: 'saved-jobs',
        canActivate: [roleGuard('candidate')],
        loadComponent: () =>
          import('./pages/saved-jobs/saved-jobs.component')
            .then(m => m.SavedJobsComponent),
        title: 'Saved Jobs | CareerWise'
      },

      {
        path: 'applications',
        canActivate: [roleGuard('candidate')],
        loadComponent: () =>
          import('./pages/applications/applications.component')
            .then(m => m.ApplicationsComponent),
        title: 'My Applications | CareerWise'
      },

      // =========================
      // NOTIFICATIONS
      // =========================

      {
        path: 'notifications',
        canActivate: [roleGuard('candidate', 'employer')],
        loadComponent: () =>
          import('./pages/notifications/notifications.component')
            .then(m => m.NotificationsComponent),
        title: 'Notifications | CareerWise'
      },

      // =========================
      // MESSAGES
      // =========================

      {
        path: 'messages',
        canActivate: [roleGuard('candidate', 'employer')],
        loadComponent: () =>
          import('./pages/messages/messages.component')
            .then(m => m.MessagesComponent),
        title: 'Messages | CareerWise'
      },

      // =========================
      // CANDIDATE PROFILE
      // =========================

      {
        path: 'profile',
        canActivate: [roleGuard('candidate')],
        loadComponent: () =>
          import('./pages/profile/profile.component')
            .then(m => m.ProfileComponent),
        title: 'My Profile | CareerWise'
      },

      // =========================
      // SETTINGS
      // =========================

      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component')
            .then(m => m.SettingsComponent),
        title: 'Settings | CareerWise'
      },

      // =========================
      // EMPLOYER
      // =========================

      {
        path: 'employer-home',
        canActivate: [roleGuard('employer')],
        loadComponent: () =>
          import('./pages/employer-dashboard/employer-dashboard.component')
            .then(m => m.EmployerDashboardComponent),
        title: 'Employer Dashboard | CareerWise'
      },

      {
        path: 'post-job',
        canActivate: [roleGuard('employer')],
        loadComponent: () =>
          import('./pages/post-job/post-job.component')
            .then(m => m.PostJobComponent),
        title: 'Post a Job | CareerWise'
      },

      {
        path: 'employer-profile',
        canActivate: [roleGuard('employer')],
        loadComponent: () =>
          import('./pages/employer-profile/employer-profile.component')
            .then(m => m.EmployerProfileComponent),
        title: 'Company Profile | CareerWise'
      },

      {
        path: 'employer-applicants/:jobId',
        canActivate: [roleGuard('employer')],
        loadComponent: () =>
          import('./pages/employer-applicants/employer-applicants.component')
            .then(m => m.EmployerApplicantsComponent),
        title: 'Applicants | CareerWise'
      },

      {
        path: 'employer-candidate/:userId',
        canActivate: [roleGuard('employer')],
        loadComponent: () =>
          import('./pages/employer-candidate-profile/employer-candidate-profile.component')
            .then(m => m.EmployerCandidateProfileComponent),
        title: 'Candidate Profile | CareerWise'
      }

    ]
  },

  // =========================
  // AUTH
  // =========================

  {
    path: '',
    component: AuthLayoutComponent,
    children: [

      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component')
            .then(m => m.LoginComponent),
        title: 'Log in | CareerWise'
      },

      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/signup/signup.component')
            .then(m => m.SignupComponent),
        title: 'Sign up | CareerWise'
      }

    ]
  },

  // =========================
  // 404
  // =========================

  {
    path: '**',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/not-found/not-found.component')
            .then(m => m.NotFoundComponent),
        title: 'Page not found | CareerWise'
      }
    ]
  }
];
