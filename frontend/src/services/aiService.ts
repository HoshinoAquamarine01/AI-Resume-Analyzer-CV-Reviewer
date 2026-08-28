import axiosInstance from "./axiosInstance";

export interface AtsOptimizationResult {
  atsScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  extractedText?: string;
  suggestions: string[];
}

export interface JobMatchResult {
  index: number;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export interface ResumeAnalysisResult {
  _id?: string;
  overallScore: number;
  atsCompatibility: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  keywordSuggestions: string[];
  grammarIssues: string[];
  formattingIssues: string[];
  recommendedRoles: string[];
  improvementTips: string[];
}

export const aiService = {
 
  optimizeForAts: async (resumeId: string, jobDescription: string): Promise<AtsOptimizationResult> => {
    const response = await axiosInstance.post("/api/ai/ats-optimize", {
      resumeId,
      jobDescription,
    });
    return response.data.data;
  },


  analyzeResume: async (resumeId: string): Promise<ResumeAnalysisResult> => {
    const response = await axiosInstance.post("/api/ai/analyze", {
      resumeId,
    });
    return response.data.data;
  },


  matchJobDescriptions: async (
    resumeId: string,
    jobDescriptions: string[]
  ): Promise<JobMatchResult[]> => {
    const response = await axiosInstance.post("/api/ai/job-matches", {
      resumeId,
      jobDescriptions,
    });
    return response.data.data;
  },

  
  extractSkills: async (resumeId: string) => {
    const response = await axiosInstance.post("/api/ai/extract-skills", {
      resumeId,
    });
    return response.data.data;
  },
};

export default aiService;
