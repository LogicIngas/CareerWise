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
}

export interface Category {
  id: string;
  name: string;
}

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: 'Interview' | 'Under Review' | 'Applied' | 'Rejected';
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

