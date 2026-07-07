export interface NewsItem {
  date: string;
  content: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  location: string;
  details?: string;
}

export interface ExperienceItem {
  role: string;
  institution: string;
  time: string;
  location: string;
  details?: string;
}

export interface AwardItem {
  name: string;
  organization: string;
  year: string;
  location: string;
  description?: string;
}

export interface Publication {
  title: string;
  status?: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  selected?: boolean;
  links: {
    paper?: string;
    github?: string;
    pdf?: string;
    arxiv?: string;
    ieee?: string;
    acm?: string;
    code?: string;
    project?: string;
  };
}

export interface TeachingItem {
  course: string;
  institution: string;
  year: string;
  location: string;
  details?: string;
}

export interface ServiceItem {
  role: string;
  organization: string;
  years: string;
}
