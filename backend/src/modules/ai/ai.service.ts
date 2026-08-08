import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { GoogleGenAI } from "@google/genai";
import { Resume, ResumeDocument } from "../../models/Resume";
import { ResumeAnalysis, ResumeAnalysisDocument } from "../../models/ResumeAnalysis";
import {
  getResumeAnalysisPrompt,
  getAtsOptimizationPrompt,
  getCoverLetterPrompt,
  getInterviewQuestionsPrompt,
  getJobMatchPrompt,
} from "../../prompts";

import { ActivityLogService } from "../activity-log/activity-log.service";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private ai: GoogleGenAI | null = null;
  private defaultModel = "gemini-3.5-flash";

  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
    @InjectModel(ResumeAnalysis.name) private readonly analysisModel: Model<ResumeAnalysisDocument>,
    private readonly configService: ConfigService,
    private readonly activityLogService: ActivityLogService
  ) {
    this.initGeminiClient();
  }

  private initGeminiClient() {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY") || process.env.GEMINI_API_KEY;
    const model = this.configService.get<string>("GEMINI_MODEL") || process.env.GEMINI_MODEL;
    if (model) {
      this.defaultModel = model;
    }
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      this.ai = new GoogleGenAI({ apiKey });
      this.logger.log(`Initialized Gemini AI Service with model: ${this.defaultModel}`);
    } else {
      this.logger.warn("GEMINI_API_KEY is not configured or uses default placeholder in .env");
    }
  }

  private getClient(): GoogleGenAI {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY") || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      throw new BadRequestException(
        "GEMINI_API_KEY is missing or invalid. Please configure your GEMINI_API_KEY in the .env file."
      );
    }
    if (!this.ai) {
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  private getModelName(): string {
    return this.configService.get<string>("GEMINI_MODEL") || process.env.GEMINI_MODEL || this.defaultModel;
  }

  private getResumeText(resume: ResumeDocument): string {
    if (resume.extractedText && resume.extractedText.trim().length > 10) {
      return resume.extractedText.trim();
    }

    const parts: string[] = [];
    if (resume.title) parts.push(`Title: ${resume.title}`);
    if (resume.skills && resume.skills.length) parts.push(`Skills: ${resume.skills.join(", ")}`);
    if (resume.experience && resume.experience.length) parts.push(`Experience: ${resume.experience.join("; ")}`);
    if (resume.education && resume.education.length) parts.push(`Education: ${resume.education.join("; ")}`);
    if (resume.projects && resume.projects.length) parts.push(`Projects: ${resume.projects.join("; ")}`);
    if (resume.certifications && resume.certifications.length) parts.push(`Certifications: ${resume.certifications.join(", ")}`);
    if (resume.languages && resume.languages.length) parts.push(`Languages: ${resume.languages.join(", ")}`);

    const combined = parts.join("\n");
    if (!combined || combined.trim().length < 5) {
      throw new BadRequestException("Resume text is empty or too short for analysis. Please upload or provide resume text first.");
    }
    return combined;
  }

  private cleanAndParseJson<T>(rawText: string): T {
    try {
      let cleanText = rawText.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      return JSON.parse(cleanText) as T;
    } catch (error) {
      this.logger.error(`Failed to parse Gemini response as JSON: ${rawText}`);
      throw new BadRequestException("Failed to parse AI response. Please ensure Gemini API key is valid and try again.");
    }
  }

  private async callGemini(prompt: string): Promise<string> {
    const client = this.getClient();
    const model = this.getModelName();

    try {
      const response = await client.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response || !response.text) {
        throw new Error("Empty response returned from Gemini API");
      }
      return response.text;
    } catch (err: any) {
      this.logger.error(`Gemini API call failed: ${err?.message || err}`);
      throw new BadRequestException(`Gemini API Error: ${err?.message || "Failed to generate AI response"}`);
    }
  }

  async analyzeResume(userId: string, resumeId: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const resumeText = this.getResumeText(resume);

    const prompt = getResumeAnalysisPrompt(resumeText);

    const rawResult = await this.callGemini(prompt);
    const parsed = this.cleanAndParseJson<{
      overallScore?: number;
      atsCompatibility?: number;
      strengths?: string[];
      weaknesses?: string[];
      missingSkills?: string[];
      keywordSuggestions?: string[];
      grammarIssues?: string[];
      formattingIssues?: string[];
      recommendedRoles?: string[];
      improvementTips?: string[];
    }>(rawResult);

    const overallScore = Math.min(100, Math.max(0, Math.round(parsed.overallScore ?? 75)));
    const atsCompatibility = Math.min(100, Math.max(0, Math.round(parsed.atsCompatibility ?? 75)));

    const analysis = await this.analysisModel.create({
      resumeId: new Types.ObjectId(resumeId),
      userId: new Types.ObjectId(userId),
      overallScore,
      atsCompatibility,
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      missingSkills: parsed.missingSkills || [],
      keywordSuggestions: parsed.keywordSuggestions || [],
      grammarIssues: parsed.grammarIssues || [],
      formattingIssues: parsed.formattingIssues || [],
      recommendedRoles: parsed.recommendedRoles || [],
      improvementTips: parsed.improvementTips || [],
      analyzedAt: new Date(),
    });

    // Update resume scores
    await this.resumeModel.findByIdAndUpdate(resumeId, {
      aiScore: overallScore,
      atsScore: atsCompatibility,
    });

    await this.activityLogService.createLog(userId, "RUN_AI_ANALYSIS", {
      resumeId,
      overallScore,
      atsCompatibility,
    });

    return analysis;
  }

  async optimizeForAts(resumeId: string, jobDescription: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const resumeText = this.getResumeText(resume);

    const prompt = getAtsOptimizationPrompt(resumeText, jobDescription);

    const rawResult = await this.callGemini(prompt);
    const parsed = this.cleanAndParseJson<{
      atsScore?: number;
      matchingKeywords?: string[];
      missingKeywords?: string[];
      optimizedResumeText?: string;
      optimizationSuggestions?: string[];
    }>(rawResult);

    const newAtsScore = Math.min(100, Math.max(0, Math.round(parsed.atsScore ?? 80)));
    const optimizedText = parsed.optimizedResumeText || resumeText;

    await this.resumeModel.findByIdAndUpdate(resumeId, {
      extractedText: optimizedText,
      atsScore: newAtsScore,
    });

    return {
      atsScore: newAtsScore,
      matchingKeywords: parsed.matchingKeywords || [],
      missingKeywords: parsed.missingKeywords || [],
      extractedText: optimizedText,
      suggestions: parsed.optimizationSuggestions || [],
    };
  }

  async generateCoverLetter(
    resumeId: string,
    jobTitle: string,
    companyName: string,
    jobDescription: string
  ) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const resumeText = this.getResumeText(resume);

    const prompt = getCoverLetterPrompt(resumeText, jobTitle, companyName, jobDescription);

    const rawResult = await this.callGemini(prompt);
    const parsed = this.cleanAndParseJson<{
      coverLetter?: string;
      keyHighlights?: string[];
    }>(rawResult);

    return {
      coverLetter: parsed.coverLetter || "",
      keyHighlights: parsed.keyHighlights || [],
    };
  }

  async matchJobDescriptions(resumeId: string, jobDescriptions: string[]) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const resumeText = this.getResumeText(resume);

    const prompt = getJobMatchPrompt(resumeText, jobDescriptions);

    const rawResult = await this.callGemini(prompt);
    const parsed = this.cleanAndParseJson<
      Array<{
        index?: number;
        matchScore?: number;
        matchedSkills?: string[];
        missingSkills?: string[];
        recommendations?: string[];
      }>
    >(rawResult);

    return parsed.map((item, idx) => ({
      index: item.index ?? idx,
      matchScore: Math.min(100, Math.max(0, Math.round(item.matchScore ?? 70))),
      matchedSkills: item.matchedSkills || [],
      missingSkills: item.missingSkills || [],
      recommendations: item.recommendations || [],
    }));
  }

  async generateInterviewQuestions(resumeId: string, jobDescription: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const resumeText = this.getResumeText(resume);

    const prompt = getInterviewQuestionsPrompt(resumeText, jobDescription);

    const rawResult = await this.callGemini(prompt);
    const parsed = this.cleanAndParseJson<{
      questions?: Array<{
        question: string;
        category?: string;
        purpose?: string;
        answerOutline?: string;
      }>;
      generalTips?: string[];
    }>(rawResult);

    return parsed.questions || [
      {
        question: `How does your experience align with the ${jobDescription.substring(0, 30)} role?`,
        category: "general",
        purpose: "Overall fit assessment",
        answerOutline: "Connect key achievements from resume to role requirements.",
      },
    ];
  }

  async improveResume(resumeId: string, section: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const resumeText = this.getResumeText(resume);

    const prompt = `You are a Professional Resume Writer.
Improve and rewrite the "${section}" section of the candidate's resume to make it vastly more compelling, impact-driven, and recruiter-ready.

Full Resume Text:
"""
${resumeText}
"""

Target Section: "${section}"

Return ONLY a valid JSON object:
{
  "section": "${section}",
  "improvedContent": "Rewritten section content with impact bullet points...",
  "improvementsSummary": ["Added action verbs", "Included metrics"],
  "updatedFullText": "Full resume text with updated section..."
}

Return ONLY pure JSON.`;

    const rawResult = await this.callGemini(prompt);
    const parsed = this.cleanAndParseJson<{
      section?: string;
      improvedContent?: string;
      improvementsSummary?: string[];
      updatedFullText?: string;
    }>(rawResult);

    const newText = parsed.updatedFullText || `${resumeText}\n\n[Improved ${section}]:\n${parsed.improvedContent || ""}`;

    await this.resumeModel.findByIdAndUpdate(resumeId, {
      extractedText: newText,
    });

    return {
      section: section,
      improvedContent: parsed.improvedContent || "",
      improvementsSummary: parsed.improvementsSummary || [],
      extractedText: newText,
    };
  }

  async extractSkills(resumeId: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const resumeText = this.getResumeText(resume);

    const prompt = `You are an AI Resume Skills Extractor.
Extract all technical skills, soft skills, frameworks/tools, and domain knowledge from the resume text.

Resume Text:
"""
${resumeText}
"""

Return ONLY a valid JSON object:
{
  "skills": ["TypeScript", "NestJS", "MongoDB", "REST APIs", "Git", "Problem Solving"],
  "technicalSkills": ["TypeScript", "NestJS", "MongoDB", "REST APIs"],
  "softSkills": ["Problem Solving", "Team Collaboration"],
  "toolsAndFrameworks": ["NestJS", "MongoDB", "Git"],
  "languages": ["English", "Vietnamese"]
}

Return ONLY pure JSON.`;

    const rawResult = await this.callGemini(prompt);
    const parsed = this.cleanAndParseJson<{
      skills?: string[];
      technicalSkills?: string[];
      softSkills?: string[];
      toolsAndFrameworks?: string[];
      languages?: string[];
    }>(rawResult);

    const extractedSkills = parsed.skills || [];

    // Save extracted skills back to resume model
    if (extractedSkills.length > 0) {
      await this.resumeModel.findByIdAndUpdate(resumeId, {
        skills: Array.from(new Set([...(resume.skills || []), ...extractedSkills])),
      });
    }

    return {
      skills: extractedSkills,
      technicalSkills: parsed.technicalSkills || [],
      softSkills: parsed.softSkills || [],
      toolsAndFrameworks: parsed.toolsAndFrameworks || [],
      languages: parsed.languages || [],
    };
  }
}
