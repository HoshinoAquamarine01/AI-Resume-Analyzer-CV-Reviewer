import mongoose, { Schema, Document } from "mongoose";

export interface IResumeAnalysis extends Document {
  resumeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

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

  analyzedAt: Date;
}

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>({
  resumeId: {
    type: Schema.Types.ObjectId,
    ref: "Resume",
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  overallScore: Number,
  atsCompatibility: Number,

  strengths: [String],
  weaknesses: [String],
  missingSkills: [String],
  keywordSuggestions: [String],
  grammarIssues: [String],
  formattingIssues: [String],
  recommendedRoles: [String],
  improvementTips: [String],

  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});
export const ResumeAnalysis = mongoose.model<IResumeAnalysis>("ResumeAnalysis",ResumeAnalysisSchema)