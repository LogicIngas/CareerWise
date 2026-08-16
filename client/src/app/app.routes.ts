import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

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
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard | CareerWise'
      },
      {
        path: 'employer-home',
        loadComponent: () => import('./pages/employer-dashboard/employer-dashboard.component').then(m => m.EmployerDashboardComponent),
        title: 'Employer Dashboard | CareerWise'
      },
      {
        path: 'post-job',
        loadComponent: () => import('./pages/post-job/post-job.component').then(m => m.PostJobComponent),
        title: 'Post a Job | CareerWise'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
