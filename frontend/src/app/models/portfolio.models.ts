export type Confidence =
  | 'Professional experience'
  | 'Strong working knowledge'
  | 'Working knowledge'
  | 'Currently developing';

export interface SocialLink {
  label: string;
  url: string;
  placeholder: boolean;
}

export interface SkillGroup {
  title: string;
  confidence: Confidence;
  skills: readonly string[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  organisation: string;
  kind: string;
  summary: string;
  highlights: readonly string[];
  technologies: readonly string[];
}

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  problem: string;
  solution: string;
  contribution: string;
  architecture: string;
  challenges: readonly string[];
  features: readonly string[];
  technologies: readonly string[];
  result: string;
  githubUrl: string;
  liveUrl: string;
  screenshot: string;
  screenshotAlt: string;
}

export interface ArchitectureStage {
  id: string;
  label: string;
  detail: string;
  technology: string;
}

export interface Achievement {
  value: string;
  label: string;
  detail: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    heroTitle: string;
    valueProposition: string;
    location: string;
    availability: string;
    experienceYears: string;
    education: string;
    institution: string;
    previousEducation: string;
    summary: string;
    resumePath: string;
    email: string;
  };
  navigation: readonly { label: string; target: string }[];
  socialLinks: readonly SocialLink[];
  skillGroups: readonly SkillGroup[];
  experience: readonly ExperienceItem[];
  projects: readonly Project[];
  architecture: readonly ArchitectureStage[];
  cloudPractices: readonly { title: string; detail: string }[];
  pipeline: readonly string[];
  achievements: readonly Achievement[];
  testimonials: readonly Testimonial[];
}
