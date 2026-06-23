import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AdminLog extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  adminId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  targetUserId?: mongoose.Types.ObjectId;

  @Prop()
  details?: string;

  createdAt: Date;
}

export type AdminLogDocument = AdminLog & Document;
export const AdminLogSchema = SchemaFactory.createForClass(AdminLog);
