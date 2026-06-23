import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Resume, ResumeDocument } from "../../models/Resume";
import { ResumeAnalysis, ResumeAnalysisDocument } from "../../models/ResumeAnalysis";

@Injectable()
export class AiService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
    @InjectModel(ResumeAnalysis.name) private readonly analysisModel: Model<ResumeAnalysisDocument>
  ) {}

  async analyzeResume(userId: string, resumeId: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    // Mock AI Analysis
    const score = 75;
    const analysis = await this.analysisModel.create({
      resumeId: new Types.ObjectId(resumeId),
      userId: new Types.ObjectId(userId),
      overallScore: score,
      analyzedAt: new Date(),
    });

    return analysis;
  }

  async optimizeForAts(resumeId: string, jobDescription: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const optimizedContent = `${resume.extractedText || ""}\n\n[ATS Optimized Content for: ${jobDescription.substring(0, 50)}...]`;
    await this.resumeModel.findByIdAndUpdate(resumeId, {
      extractedText: optimizedContent,
    });

    return { extractedText: optimizedContent };
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

    const coverLetter = `Dear Hiring Team at ${companyName},\n\nI am writing to express my interest in the ${jobTitle} position. Based on my experience, I am confident in my ability to deliver excellent results.\n\nSincerely,\nApplicant`;
    return { coverLetter };
  }

  async matchJobDescriptions(resumeId: string, jobDescriptions: string[]) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const matches = jobDescriptions.map((desc, idx) => ({
      index: idx,
      matchScore: 85 - idx * 5,
      matchedSkills: ["typescript", "mongodb"],
      missingSkills: ["aws"],
      recommendations: ["Learn AWS Cloud Development"],
    }));

    return matches;
  }

  async generateInterviewQuestions(resumeId: string, jobDescription: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const questions = [
      "Can you describe your experience with TypeScript?",
      "How do you handle scaling backend services?",
      "What are the benefits of using NestJS over vanilla Express?",
    ];

    return questions;
  }

  async improveResume(resumeId: string, section: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const improvedText = `${resume.extractedText || ""}\n\n[Improved Section: ${section}]`;
    await this.resumeModel.findByIdAndUpdate(resumeId, { extractedText: improvedText });

    return { extractedText: improvedText };
  }

  async extractSkills(resumeId: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    const skills = ["TypeScript", "NestJS", "MongoDB", "Express", "Node.js", "REST APIs"];
    return { skills };
  }
}
