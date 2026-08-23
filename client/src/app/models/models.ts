export interface Job {
  id: string;
  title: string;
  company: string;
  companyInitial: string;
  companyColor: string;
  tags: string[];
  location: string;
  salaryRange: string;
  postedTime: string;
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Remote';
  isRemote: boolean;
  isSaved?: boolean;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Application {
  id: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  dateApplied?: string;
  status: 'Interview' | 'Under Review' | 'Applied' | 'Offer' | 'Rejected' | string;
  location?: string;
  salaryRange?: string;
  notes?: string;
}

export interface EmployerStat {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
}

export interface EmployerPosting {
  id: string;
  title: string;
  applicantsCount: number;
  status: 'Active' | 'Paused' | 'Closed';
}
