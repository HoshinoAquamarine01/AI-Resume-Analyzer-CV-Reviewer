export type TemplateId = 'modern' | 'professional' | 'minimalist' | 'creative';

export type ColorTheme = 'indigo' | 'emerald' | 'blue' | 'purple' | 'rose' | 'slate';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ProjectItem {
  id: string;
  name: string;
  techStack: string;
  link?: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeBuilderData {
  title: string;
  templateId: TemplateId;
  colorTheme: ColorTheme;
  personal: PersonalInfo;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export interface ColorThemeOption {
  id: ColorTheme;
  name: string;
  primaryHex: string;
  secondaryHex: string;
  bgHex: string;
}
