import mongoose, { Schema, Document } from "mongoose";
export interface IInterviewSession extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;

  jobTitle: string;
  companyName: string;

  questions: string[];
  answers: string[];
  feedback: string[];

  score: number;

  strengths: string[];
  weaknesses: string[];

  sessionType: "technical" | "hr";

  videoUrl?: string;
  audioUrl?: string;
  confidenceScore?: number;

  createdAt: Date;
}
const InterviewSessionSchema = new Schema<IInterviewSession>(
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

    questions: [String],
    answers: [String],
    feedback: [String],

    score: Number,

    strengths: [String],
    weaknesses: [String],

    sessionType: {
      type: String,
      enum: ["technical", "hr"],
    },

    videoUrl: String,
    audioUrl: String,
    confidenceScore: Number,
  },
  { timestamps: { createdAt: true, updatedAt: false } 
    }
)
export const InterviewSession = mongoose.model<IInterviewSession>("InterviewSession",InterviewSessionSchema)
