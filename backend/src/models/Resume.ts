import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: true })
export class Resume extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({
    type: String,
    enum: ["pdf", "docx"],
    required: true,
  })
  fileType: "pdf" | "docx";

  @Prop()
  extractedText?: string;

  @Prop({ type: [String] })
  skills?: string[];

  @Prop({ type: [String] })
  education?: string[];

  @Prop({ type: [String] })
  experience?: string[];

  @Prop({ type: [String] })
  projects?: string[];

  @Prop({ type: [String] })
  certifications?: string[];

  @Prop({ type: [String] })
  languages?: string[];

  @Prop()
  totalExperienceYears?: number;

  @Prop()
  aiScore?: number;

  @Prop()
  atsScore?: number;
}

export type ResumeDocument = Resume & Document;
export const ResumeSchema = SchemaFactory.createForClass(Resume);
