
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
  detailedFeedback?: {
    formatting?: string[];
    grammar?: string[];
    impact?: string[];
  };
}

export interface CoverLetterResult {
  content: string;
  bullets?: string[];
  subjectLine?: string;
}

export interface JobMatchResult {
  matched: boolean;
  matchScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
}

export interface InterviewQuestion {
  id?: string;
  question: string;
  intent?: string;
  difficulty?: "easy" | "medium" | "hard" | string;
  sampleAnswer?: string;
}

export interface InterviewSessionResult {
  questions: InterviewQuestion[];
  generalTips?: string[];
}

export interface ChatMessage {
  role: "system" | "assistant" | "user";
  content: string;
  timestamp?: string;
}

export default AIRequest;
