export type SkillCategory = "sysadmin" | "networking" | "cybersecurity" | "development";

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  experienceSummary: string;
  location: string;
  avatar: string;
  resume: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  technologiesCount: number;
  introTexts: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: number;
  icon?: string;
  description?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  date: string;
  body?: string;
}

export interface Experience {
  slug: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface Certification {
  slug: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  image?: string;
  description?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  date: string;
  tags: string[];
  category: string;
  draft: boolean;
  featured: boolean;
  body: string;
  readingTime: string;
}

export interface SiteSettings {
  personal: PersonalInfo;
  socialLinks: SocialLink[];
}
