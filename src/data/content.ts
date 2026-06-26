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

export const content = {
  name: "Yi-Chun Liao (廖奕鈞)",
  title: "Incoming Ph.D. Student",
  email: "yi-chun.liao@duke.edu",
  headshot: "/assets/me.jpg", // e.g., "/assets/headshot.jpg"
  cv: "/assets/CV.pdf", // e.g., "/assets/CV.pdf"
  socials: {
    github: "https://github.com/datou0718",
    scholar: "https://scholar.google.com/citations?user=n7W1nP8AAAAJ&hl=en",
    linkedin: "https://www.linkedin.com/in/yi-chun-liao-07b414269/",
    instagram: "https://www.instagram.com/datou_0718/",
  },
  bio: "I am an incoming Ph.D. student at [Duke Center for Computational Evolutionary Intelligence (CEI)](https://cei.pratt.duke.edu/), where I will continue exploring in-memory computing through algorithm-hardware co-design. My recent works focus on accelerating various applications with content-addressable memory (CAM), including tree-based machine learning and retrieval-augmented generation. It is my honor to have worked with [Prof. X. Sharon Hu](https://sites.nd.edu/xsharon-hu/) at the [University of Notre Dame](https://www.nd.edu/), [Prof. Tei-Wei Kuo](https://www.csie.ntu.edu.tw/~ktw/), and [Prof. Yuan-Hao Chang](https://www.csie.ntu.edu.tw/~johnson/) at [National Taiwan University](https://www.ntu.edu.tw/).",
  researchInterests: [
    "In-Memory Computing",
    "Computer Architecture",
    "Algorithm-Hardware Co-Design",
  ],
  education: [
    {
      degree: "Ph.D. in Electrical and Computer Engineering",
      institution: "Duke University",
      year: "2026 - ",
      location: "Durham, NC"
    }
    , {
      degree: "B.Sc. in Computer Science and Information Engineering",
      institution: "National Taiwan University",
      year: "2021 - 2026",
      location: "Taipei, Taiwan"
    }
  ] as EducationItem[],
  experience: [
    {
      role: "Research Intern",
      institution: "University of Notre Dame",
      time: "2025 - ",
      location: "Notre Dame, IN",
      details: "Advisor: Prof. X. Sharon Hu"
    },
    {
      role: "Research Assistant",
      institution: "Academia Sinica",
      time: "2024 - 2026",
      location: "Taipei, Taiwan",
      details: "Advisors: Prof. Yuan-Hao Chang and Prof. Tei-Wei Kuo"
    },
    {
      role: "Research Assistant",
      institution: "Academia Sinica",
      time: "2023 - 2024",
      location: "Taipei, Taiwan",
      details: "Advisor: Prof. Yennun Huang"
    }
  ] as ExperienceItem[],
  awards: [
    {
      name: "First Place of Bachelor Thesis Award",
      organization: "National Taiwan University",
      year: "2025",
      location: "Taipei, Taiwan"
    },
    {
      name: "Irving T. Ho Memorial Scholarship",
      organization: "National Taiwan University",
      year: "2025",
      location: "Taipei, Taiwan"
    },
    {
      name: "Dean's List Award",
      organization: "National Taiwan University",
      year: "2025",
      location: "Taipei, Taiwan"
    }
  ] as AwardItem[],
  teaching: [
    {
      course: "CSIE3340 Computer Architecture",
      institution: "National Taiwan University",
      year: "2024",
      location: "Taipei, Taiwan",
      details: "Undergraduate Teaching Assistant"
    }
  ] as TeachingItem[],
  service: [
    {
      role: "Reviewer",
      organization: "Conference/Journal Name (e.g., DAC, ICCAD, TCAD)",
      years: "2024 - Present"
    }
  ] as ServiceItem[]
};
