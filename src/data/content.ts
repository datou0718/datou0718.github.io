export interface NewsItem {
  date: string;
  content: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface AwardItem {
  name: string;
  organization: string;
  year: string;
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
  },
  bio: "I am an incoming Ph.D. student at [Duke Center for Computational Evolutionary Intelligence (CEI)](https://cei.pratt.duke.edu/), where I will continue exploring in-memory computing through hardware/software co-design. My recent works focus on accelerating various applications with content-addressable memory (CAM), including tree-based machine learning and retrieval-augmented generation. It is my honor to have worked with [Prof. X. Sharon Hu](https://sites.nd.edu/xsharon-hu/) at the [University of Notre Dame](https://www.nd.edu/), [Prof. Tei-Wei Kuo](https://www.csie.ntu.edu.tw/~ktw/), and [Prof. Yuan-Hao Chang](https://www.csie.ntu.edu.tw/~johnson/) at [National Taiwan University](https://www.ntu.edu.tw/).",
  researchInterests: [
    "In-Memory Computing",
    "Computer Architecture",
    "Algorithm/Hardware Co-Design",
  ],
  education: [
    {
      degree: "Ph.D. in Electrical and Computer Engineering",
      institution: "Duke University",
      year: "2026-",
      details: "Center for Computational Evolutionary Intelligence (CEI)",
    }
    , {
      degree: "B.Sc. in Computer Science and Information Engineering",
      institution: "National Taiwan University",
      year: "2021-2026",
      details: "Co-advised by Prof. Tei-Wei Kuo and Prof. Yuan-Hao Chang."
    }
  ] as EducationItem[],
  awards: [
    {
      name: "First Place of Bachelor Thesis Award",
      organization: "National Taiwan University",
      year: "2025",
      description: "Distinguished through a three-stage selection process and recognized as one of the top 2 in the CSIE Department, the best in the EECS College, and one of the top 6 university-wide."
    },
    {
      name: "Irving T. Ho Memorial Scholarship",
      organization: "National Taiwan University",
      year: "2025",
      description: "Awarded to 3 students in the CSIE department for academic and research excellence."
    },
    {
      name: "Dean's List Award",
      organization: "National Taiwan University",
      year: "2025",
      description: "Ranked 1/155 in the department for both Spring and Fall 2024 semesters."
    }
  ] as AwardItem[],
  teaching: [
    {
      course: "CSIE3340 Computer Architecture",
      institution: "National Taiwan University",
      year: "2024",
      details: "Undergraduate Teaching Assistant"
    }
  ] as TeachingItem[],
  service: [
    {
      role: "Reviewer",
      organization: "Conference/Journal Name (e.g., DAC, ICCAD, TCAD)",
      years: "2024-Present"
    }
  ] as ServiceItem[]
};
