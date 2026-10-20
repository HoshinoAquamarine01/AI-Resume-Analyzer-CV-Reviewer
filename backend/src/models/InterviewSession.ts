import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class InterviewSession extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true })
  resumeId: mongoose.Types.ObjectId;

  @Prop()
  jobTitle?: string;

  @Prop()
  companyName?: string;

  @Prop({ type: [String] })
  questions?: string[];

  @Prop({ type: [String] })
  answers?: string[];

  @Prop({ type: [String] })
  feedback?: string[];

  @Prop()
  score?: number;

  @Prop({ type: [String] })
  strengths?: string[];

  @Prop({ type: [String] })
  weaknesses?: string[];

  @Prop({ type: [String] })
  generalTips?: string[];

  @Prop({
    type: String,
    enum: ["technical", "hr"],
  })
  sessionType?: "technical" | "hr";

  @Prop()
  videoUrl?: string;

  @Prop()
  audioUrl?: string;

  @Prop()
  confidenceScore?: number;

  createdAt: Date;
}

export type InterviewSessionDocument = InterviewSession & Document;
export const InterviewSessionSchema =
  SchemaFactory.createForClass(InterviewSession);
