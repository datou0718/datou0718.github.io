import type { EducationItem, ExperienceItem, AwardItem, TeachingItem, ServiceItem } from '../types/content';
export type * from '../types/content';

export const content = {
  name: {
    english: "Yi-Chun Liao",
    chinese: "廖奕鈞"
  },
  title: "Ph.D. Student in Duke ECE",
  email: "yi-chun.liao@duke.edu",
  headshot: "/assets/me.jpg",
  cv: "/assets/CV.pdf",
  profiles: {
    github: "https://github.com/datou0718",
    scholar: "https://scholar.google.com/citations?user=n7W1nP8AAAAJ&hl=en",
    linkedin: "https://www.linkedin.com/in/yi-chun-liao-07b414269/",
    instagram: "https://www.instagram.com/datou_0718/",
  },
  bio: "I am a first-year Ph.D. student in the [CEI Lab](https://cei.pratt.duke.edu/) of the [Department of Electrical and Computer Engineering](https://ece.duke.edu/) at [Duke University](https://www.duke.edu/), advised by [Prof. Yiran Chen](https://ece.duke.edu/people/yiran-chen/). I enjoy exploring in-memory computing through algorithm-hardware co-design, accelerating various applications such as retrieval-augmented generation and tree-based machine learning. Before joining the CEI Lab, I had the privilege of working with [Prof. X. Sharon Hu](https://sites.nd.edu/xsharon-hu/) at the [University of Notre Dame](https://www.nd.edu/), [Prof. Tei-Wei Kuo](https://www.csie.ntu.edu.tw/~ktw/) and [Prof. Yuan-Hao Chang](https://www.csie.ntu.edu.tw/~johnson/) at [National Taiwan University](https://www.ntu.edu.tw/).",
  researchInterests: [
    "In-Memory Computing",
    "Algorithm-Hardware Co-Design",
  ],
  education: [
    {
      degree: "Ph.D. in Electrical and Computer Engineering",
      institution: "Duke University",
      year: "2026 - Present",
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
      time: "2025 - Present",
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
      name: "Dean's List Award",
      organization: "National Taiwan University",
      year: "2025",
      location: "Taipei, Taiwan"
    },
    {
      name: "Irving T. Ho Memorial Scholarship",
      organization: "Irving T. Ho Memorial Foundation",
      year: "2024",
      location: "Taipei, Taiwan"
    }
  ] as AwardItem[],
  teaching: [
    {
      course: "CSIE3340 Computer Architecture",
      institution: "National Taiwan University",
      year: "2024",
      location: "Taipei, Taiwan"
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
