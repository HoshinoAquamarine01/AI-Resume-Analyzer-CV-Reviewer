import mongoose, { Schema, Document } from "mongoose";

export interface IJobMatch {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;

  jobTitle: string;
  companyName: string;
  jobDescription: string;

  matchScore: number;

  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];

  coverLetterId?: mongoose.Types.ObjectId;

  salaryRange?: string;
  location?: string;
  remote?: boolean;
  industry?: string;

  createdAt: Date;
}
const JobMatchSchema = new Schema<IJobMatch>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    jobTitle: String,
    companyName: String,
    jobDescription: String,

    matchScore: Number,

    matchedSkills: [String],
    missingSkills: [String],
    recommendations: [String],

    coverLetterId: {
      type: Schema.Types.ObjectId,
      ref: "CoverLetter",
    },

    salaryRange: String,
    location: String,
    remote: Boolean,
    industry: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)
export const JobMatch = mongoose.model<IJobMatch>("JobMatch",JobMatchSchema)
