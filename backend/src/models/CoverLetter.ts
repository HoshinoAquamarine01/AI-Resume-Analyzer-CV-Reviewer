import mongoose, { Schema, Document } from "mongoose";

export interface ICoverLetter extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  jobMatchId: mongoose.Types.ObjectId;

  companyName: string;
  jobTitle: string;

  content: string;

  tone: "professional" | "formal" | "creative";

  generatedByAI: boolean;

  createdAt: Date;
}
const CoverLetterSchema = new Schema<ICoverLetter>(
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

    jobMatchId: {
      type: Schema.Types.ObjectId,
      ref: "JobMatch",
      required: true,
    },

    companyName: String,
    jobTitle: String,

    content: String,

    tone: {
      type: String,
      enum: ["professional", "formal", "creative"],
    },

    generatedByAI: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
    
)
export const CoverLetter = mongoose.model<ICoverLetter>("CoverLetter",CoverLetterSchema)