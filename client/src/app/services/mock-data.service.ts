import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Category, Job, Stat } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  getStats(): Observable<Stat[]> {
    return of([
      { label: 'Open Jobs', value: '50k+', icon: 'work' },
      { label: 'Companies', value: '12k+', icon: 'business' },
      { label: 'Candidates', value: '1.2M', icon: 'people' },
      { label: 'Hire Rate', value: '94%', icon: 'trending_up' }
    ]).pipe(delay(500));
  }

  getCategories(): Observable<Category[]> {
    return of([
      { id: '1', name: 'Engineering' },
      { id: '2', name: 'Design' },
      { id: '3', name: 'Marketing' },
      { id: '4', name: 'Data & AI' },
      { id: '5', name: 'Product' },
      { id: '6', name: 'Sales' },
      { id: '7', name: 'Finance' },
      { id: '8', name: 'Operations' }
    ]).pipe(delay(500));
  }

  getFeaturedJobs(): Observable<Job[]> {
    return of<Job[]>([
      {
        id: '1',
        title: 'Senior Frontend Engineer',
        company: 'Nimbus Labs',
        companyInitial: 'N',
        companyColor: 'bg-indigo-500',
        tags: ['React', 'TypeScript', 'Tailwind'],
        location: 'San Francisco, CA',
        salaryRange: '$140k - $180k',
        postedTime: '2 days ago',
        type: 'Full-time',
        isRemote: false
      },
      {
        id: '2',
        title: 'Product Designer',
        company: 'Auroria',
        companyInitial: 'A',
        companyColor: 'bg-blue-500',
        tags: ['Figma', 'UX', 'Design Systems'],
        location: 'Remote',
        salaryRange: '$90k - $120k',
        postedTime: '5 days ago',
        type: 'Full-time',
        isRemote: true
      },
      {
        id: '3',
        title: 'Backend Engineer',
        company: 'Datastack',
        companyInitial: 'D',
        companyColor: 'bg-purple-500',
        tags: ['Node.js', 'PostgreSQL', 'AWS'],
        location: 'Austin, TX',
        salaryRange: '$130k - $170k',
        postedTime: '1 week ago',
        type: 'Full-time',
        isRemote: false
      },
      {
        id: '4',
        title: 'Marketing Manager',
        company: 'BrightWave',
        companyInitial: 'B',
        companyColor: 'bg-pink-500',
        tags: ['SEO', 'Content', 'Growth'],
        location: 'New York, NY',
        salaryRange: '$85k - $110k',
        postedTime: '3 days ago',
        type: 'Full-time',
        isRemote: false
      },
      {
        id: '5',
        title: 'Data Scientist',
        company: 'Quantify',
        companyInitial: 'Q',
        companyColor: 'bg-teal-500',
        tags: ['Python', 'ML', 'Pandas'],
        location: 'Remote',
        salaryRange: '$70/hr',
        postedTime: '6 days ago',
        type: 'Contract',
        isRemote: true
      },
      {
        id: '6',
        title: 'DevOps Engineer',
        company: 'CloudForge',
        companyInitial: 'C',
        companyColor: 'bg-orange-500',
        tags: ['Kubernetes', 'Terraform', 'CI/CD'],
        location: 'Seattle, WA',
        salaryRange: '$120k - $160k',
        postedTime: '4 days ago',
        type: 'Full-time',
        isRemote: false
      }
    ]).pipe(delay(800));
  }

  getDashboardStats(): Observable<{ applications: number, saved: number, views: number, interviews: number }> {
    return of({
      applications: 12,
      saved: 8,
      views: 143,
      interviews: 3
    }).pipe(delay(300));
  }

  getRecentApplications(): Observable<any[]> {
    return of([
      { id: '1', jobTitle: 'Senior Frontend Engineer', company: 'Nimbus Labs', status: 'Interview' },
      { id: '2', jobTitle: 'Product Designer', company: 'Auroria', status: 'Under Review' },
      { id: '3', jobTitle: 'Backend Engineer', company: 'Datastack', status: 'Applied' }
    ]).pipe(delay(500));
  }

  getEmployerStats(): Observable<any[]> {
    return of([
      { label: 'Active Jobs', value: 6, icon: 'briefcase' },
      { label: 'Total Applicants', value: 248, icon: 'users' },
      { label: 'Job Views', value: '4.2k', icon: 'eye' },
      { label: 'New Today', value: 18, icon: 'file' }
    ]).pipe(delay(400));
  }

  getEmployerPostings(): Observable<any[]> {
    return of([
      { id: '1', title: 'Senior Frontend Engineer', applicantsCount: 64, status: 'Active' },
      { id: '2', title: 'Product Designer', applicantsCount: 41, status: 'Active' },
      { id: '3', title: 'Backend Engineer', applicantsCount: 52, status: 'Paused' },
      { id: '4', title: 'DevOps Engineer', applicantsCount: 29, status: 'Closed' }
    ]).pipe(delay(600));
  }

  getNotifications(): Observable<any[]> {
    return of([
      { id: '1', type: 'application_view', title: 'Application viewed', message: 'Nimbus Labs viewed your application.', time: '5 min ago', unread: true },
      { id: '2', type: 'message', title: 'New message', message: 'You have a new message from Auroria.', time: '1 hour ago', unread: true },
      { id: '3', type: 'job_match', title: 'New job match', message: '3 new jobs match your profile.', time: '3 hours ago', unread: false },
      { id: '4', type: 'profile_view', title: 'Profile view', message: 'A recruiter from Datastack viewed your profile.', time: 'Yesterday', unread: false }
    ]).pipe(delay(400));
  }

  getDetailedApplications(): Observable<{stats: any, list: any[]}> {
    return of({
      stats: { total: 5, interviews: 1, offers: 1 },
      list: [
        { id: '1', jobTitle: 'Senior Frontend Engineer', company: 'Nimbus Labs', dateApplied: 'Jul 2, 2026', status: 'Interview' },
        { id: '2', jobTitle: 'Product Designer', company: 'Auroria', dateApplied: 'Jun 28, 2026', status: 'Under Review' },
        { id: '3', jobTitle: 'Backend Engineer', company: 'Datastack', dateApplied: 'Jun 25, 2026', status: 'Applied' },
        { id: '4', jobTitle: 'Marketing Manager', company: 'BrightWave', dateApplied: 'Jun 20, 2026', status: 'Offer' },
        { id: '5', jobTitle: 'Data Scientist', company: 'Quantify', dateApplied: 'Jun 15, 2026', status: 'Rejected' }
      ]
    }).pipe(delay(500));
  }

  getUserProfile(): Observable<any> {
    return of({
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@email.com',
      phone: '+1 (555) 012-3456',
      title: 'Senior Frontend Engineer',
      location: 'San Francisco, CA',
      summary: 'Senior frontend engineer with 6 years building performant, accessible web apps.',
      skills: ['React', 'TypeScript', 'Node.js', 'UI/UX', 'GraphQL', 'Tailwind']
    }).pipe(delay(300));
  }
}
