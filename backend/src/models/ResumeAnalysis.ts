import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class ResumeAnalysis extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true })
  resumeId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: mongoose.Types.ObjectId;

  @Prop()
  overallScore?: number;

  @Prop()
  atsCompatibility?: number;

  @Prop({ type: [String] })
  strengths?: string[];

  @Prop({ type: [String] })
  weaknesses?: string[];

  @Prop({ type: [String] })
  missingSkills?: string[];

  @Prop({ type: [String] })
  keywordSuggestions?: string[];

  @Prop({ type: [String] })
  grammarIssues?: string[];

  @Prop({ type: [String] })
  formattingIssues?: string[];

  @Prop({ type: [String] })
  recommendedRoles?: string[];

  @Prop({ type: [String] })
  improvementTips?: string[];

  @Prop({ type: Date, default: Date.now })
  analyzedAt: Date;
}

export type ResumeAnalysisDocument = ResumeAnalysis & Document;
export const ResumeAnalysisSchema = SchemaFactory.createForClass(ResumeAnalysis);