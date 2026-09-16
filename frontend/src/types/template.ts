export interface TemplateSection {
  name: string;
  fields: string[];
}

export interface TemplateSampleData {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  experience: string[];
}

export interface TemplateColorScheme {
  primary: string;
  secondary: string;
  bg: string;
}

export interface ResumeTemplate {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  description: string;
  atsScore: number;
  popular: boolean;
  recommendedFor: string[];
  tags: string[];
  colorScheme: TemplateColorScheme;
  sections: TemplateSection[];
  sampleData: TemplateSampleData;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface TemplateFilterState {
  category: string;
  search: string;
  sortBy: "popular" | "ats" | "name";
  atsOnly: boolean;
}
