import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  phoneNumber?: string;
  avatarUrl?: string;
  subscriptionId?: mongoose.Types.ObjectId;
  resumeIds?: mongoose.Types.ObjectId[];
  linkedInUrl?: string;
  githubUrl?: string;
  careerLevel?: "student" | "junior" | "mid" | "senior";
  preferredJobTitles?: string[];
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phoneNumber: String,
    avatarUrl: String,

    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },

    resumeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resume",
      },
    ],

    linkedInUrl: String,
    githubUrl: String,

    careerLevel: {
      type: String,
      enum: ["student", "junior", "mid", "senior"],
    },

    preferredJobTitles: [String],
  },
  { timestamps: true },
);
export const User = mongoose.model<IUser>("User",userSchema)