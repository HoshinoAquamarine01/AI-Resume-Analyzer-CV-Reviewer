// Placeholder for Resume model
import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  fileUrl: string;
  fileType: "pdf" | "docx";
  extractedText: string;

  skills: string[];
  education: string[];
  experience: string[];
  projects: string[];
  certifications: string[];
  languages: string[];

  totalExperienceYears: number;
  aiScore: number;
  atsScore: number;

  createdAt: Date;
  updatedAt: Date;
}
const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    fileUrl: { type: String, required: true },

    fileType: {
      type: String,
      enum: ["pdf", "docx"],
      required: true,
    },

    extractedText: String,

    skills: [String],
    education: [String],
    experience: [String],
    projects: [String],
    certifications: [String],
    languages: [String],

    totalExperienceYears: Number,
    aiScore: Number,
    atsScore: Number,
  },
  { timestamps: true }
)

export const Resume = mongoose.model<IResume>("Resume",ResumeSchema)
