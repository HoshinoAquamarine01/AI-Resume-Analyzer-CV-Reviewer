import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class CoverLetter extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true })
  resumeId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "JobMatch" })
  jobMatchId?: mongoose.Types.ObjectId;

  @Prop()
  companyName?: string;

  @Prop()
  jobTitle?: string;

  @Prop()
  content?: string;

  @Prop({
    type: String,
    enum: ["professional", "formal", "creative"],
  })
  tone?: "professional" | "formal" | "creative";

  @Prop({ type: Boolean, default: true })
  generatedByAI?: boolean;

  createdAt: Date;
}

export type CoverLetterDocument = CoverLetter & Document;
export const CoverLetterSchema = SchemaFactory.createForClass(CoverLetter);