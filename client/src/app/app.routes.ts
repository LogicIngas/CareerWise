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
        loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
        title: 'CareerWise | Find the job that moves your career forward'
      },
      {
        path: 'jobs',
        loadComponent: () => import('./pages/find-jobs/find-jobs.component').then(m => m.FindJobsComponent),
        title: 'Find Jobs | CareerWise'
      }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard('candidate')],
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard | CareerWise'
      },
      {
        path: 'saved-jobs',
        canActivate: [roleGuard('candidate')],
        loadComponent: () => import('./pages/saved-jobs/saved-jobs.component').then(m => m.SavedJobsComponent),
        title: 'Saved Jobs | CareerWise'
      },
      {
        path: 'applications',
        canActivate: [roleGuard('candidate')],
        loadComponent: () => import('./pages/applications/applications.component').then(m => m.ApplicationsComponent),
        title: 'My Applications | CareerWise'
      },
      {
        path: 'notifications',
        canActivate: [roleGuard('candidate')],
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
        title: 'Notifications | CareerWise'
      },
      {
        path: 'profile',
        canActivate: [roleGuard('candidate')],
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'My Profile | CareerWise'
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings | CareerWise'
      },
      {
        path: 'employer-home',
        canActivate: [roleGuard('employer')],
        loadComponent: () => import('./pages/employer-dashboard/employer-dashboard.component').then(m => m.EmployerDashboardComponent),
        title: 'Employer Dashboard | CareerWise'
      },
      {
        path: 'post-job',
        canActivate: [roleGuard('employer')],
        loadComponent: () => import('./pages/post-job/post-job.component').then(m => m.PostJobComponent),
        title: 'Post a Job | CareerWise'
      },
      {
        path: 'employer-profile',
        canActivate: [roleGuard('employer')],
        loadComponent: () => import('./pages/employer-profile/employer-profile.component').then(m => m.EmployerProfileComponent),
        title: 'Company Profile | CareerWise'
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        title: 'Log in | CareerWise'
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
        title: 'Sign up | CareerWise'
      }
    ]
  },
  {
    path: '**',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
        title: 'Page not found | CareerWise'
      }
    ]
  }
];
