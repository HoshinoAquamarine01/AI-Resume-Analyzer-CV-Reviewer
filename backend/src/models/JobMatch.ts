import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class JobMatch extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true })
  resumeId: mongoose.Types.ObjectId;

  @Prop()
  jobTitle?: string;

  @Prop()
  companyName?: string;

  @Prop()
  jobDescription?: string;

  @Prop()
  matchScore?: number;

  @Prop({ type: [String] })
  matchedSkills?: string[];

  @Prop({ type: [String] })
  missingSkills?: string[];

  @Prop({ type: [String] })
  recommendations?: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoverLetter" })
  coverLetterId?: mongoose.Types.ObjectId;

  @Prop()
  salaryRange?: string;

  @Prop()
  location?: string;

  @Prop()
  remote?: boolean;

  @Prop()
  industry?: string;

  createdAt: Date;
}

export type JobMatchDocument = JobMatch & Document;
export const JobMatchSchema = SchemaFactory.createForClass(JobMatch);
