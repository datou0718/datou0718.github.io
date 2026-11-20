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
  researchQuestion?: string;
  figure?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
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

export interface ReviewerItem {
  venue: string;
  years: string;
}

export interface Profile {
  siteUrl: string;
  name: { english: string; chinese: string };
  title: string;
  email: string;
  headshot: string;
  cv: string;
  profiles: {
    github: string;
    scholar: string;
    linkedin?: string;
    instagram?: string;
  };
  researchInterests: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  awards: AwardItem[];
  teaching: TeachingItem[];
  reviewer: ReviewerItem[];
}

export interface Institution {
  initials: string;
  logo: string;
  color?: string;
}
