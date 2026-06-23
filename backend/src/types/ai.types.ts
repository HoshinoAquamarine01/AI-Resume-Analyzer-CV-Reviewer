

export interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  metadata?: Record<string, any>;
}

export interface AIResponse<T = any> {
  id?: string;
  model?: string;
  output?: T;
  raw?: any;
  createdAt?: string;
}

export interface ResumeAnalysisResult {
  score: number; 
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywordsMatch?: Record<string, number>;
}

export interface CoverLetterResult {
  content: string;
  bullets?: string[];
}

export interface JobMatchResult {
  matched: boolean;
  matchScore?: number;
  matchedKeywords?: string[];
}

export interface InterviewQuestion {
  question: string;
  intent?: string;
  difficulty?: "easy" | "medium" | "hard" | string;
}

export interface ChatMessage {
  role: "system" | "assistant" | "user";
  content: string;
}

export default AIRequest;
