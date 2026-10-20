
export type DateString = string; 

export interface Location {
  city?: string;
  region?: string; 
  country?: string;
}

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  title?: string; 
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  location?: Location;
  summary?: string;
}

export interface Experience {
  id?: string;
  title: string;
  company?: string;
  location?: Location | string;
  startDate?: DateString;
  endDate?: DateString | null; 
  currentlyWorking?: boolean;
  description?: string;
  highlights?: string[]; 
}

export interface Education {
  id?: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: DateString;
  endDate?: DateString | null;
  grade?: string;
  description?: string;
}

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"
  | number;

export interface Skill {
  name: string;
  level?: SkillLevel;
  keywords?: string[];
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  link?: string;
  technologies?: string[];
  startDate?: DateString;
  endDate?: DateString | null;
}

export interface Certification {
  id?: string;
  name: string;
  issuer?: string;
  date?: DateString;
  credentialId?: string;
  url?: string;
}

export interface Language {
  name: string;
  level?: "Basic" | "Conversational" | "Professional" | "Native" | string;
}

export interface Link {
  label?: string;
  url: string;
}

export interface Resume {
  id?: string;
  _id?: string;
  userId?: string;
  title?: string;
  personal?: PersonalInfo;
  summary?: string;
  experiences?: Experience[];
  educations?: Education[];
  skills?: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  links?: Link[];
  rawText?: string; 
  extractedText?: string;
  fileUrl?: string;
  source?: "upload" | "manual" | "parsed" | string;
  createdAt?: DateString;
  updatedAt?: DateString;
}

export interface ParsedResume extends Resume {
  parsedAt?: DateString;
  parserVersion?: string;
}

export interface ResumeAnalysis {
  id?: string;
  _id?: string;
  resumeId?: string;
  score?: number; 
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  createdAt?: DateString;
}

export default Resume;
