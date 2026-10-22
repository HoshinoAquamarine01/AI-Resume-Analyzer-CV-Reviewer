import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { comparePassword as comparePasswordUtil } from "../utils/comparePassword";
import { hashPassword } from "../utils/hashPassword";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop()
  googleId?: string;

  @Prop()
  githubId?: string;

  @Prop({
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  })
  authProvider?: "local" | "google" | "github";

  @Prop({
    type: String,
    enum: ["user", "admin"],
    default: "user",
  })
  role: "user" | "admin";

  @Prop({ default: true })
  isActive?: boolean;

  @Prop()
  phoneNumber?: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  bio?: string;

  @Prop()
  targetRole?: string;

  @Prop()
  location?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Subscription" })
  subscriptionId?: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }] })
  resumeIds?: mongoose.Types.ObjectId[];

  @Prop()
  linkedInUrl?: string;

  @Prop()
  githubUrl?: string;

  @Prop({
    type: String,
    enum: ["student", "junior", "mid", "senior"],
  })
  careerLevel?: "student" | "junior" | "mid" | "senior";

  @Prop({ type: [String] })
  preferredJobTitles?: string[];


  comparePassword: (password: string) => Promise<boolean>;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    return next();
  }
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) {
    return false;
  }
  return comparePasswordUtil(password, this.password);
};
