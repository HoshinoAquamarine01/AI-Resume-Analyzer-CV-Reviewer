export type SessionType = "technical" | "hr";

export interface InterviewSession {
  _id: string;
  userId?: string;
  resumeId: string;
  jobTitle?: string;
  companyName?: string;
  sessionType?: SessionType;
  questions?: string[];
  answers?: string[];
  feedback?: string[];
  score?: number;
  strengths?: string[];
  weaknesses?: string[];
  generalTips?: string[];
  createdAt?: string;
}

export interface CreateInterviewPayload {
  resumeId: string;
  jobTitle: string;
  companyName: string;
  sessionType: SessionType;
}

export interface SubmitAnswersPayload {
  sessionId: string;
  answers: string[];
}
