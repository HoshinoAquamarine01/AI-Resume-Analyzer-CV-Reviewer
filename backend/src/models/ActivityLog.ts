import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ActivityLog extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  details?: Record<string, unknown>;

  @Prop()
  ipAddress?: string;

  createdAt: Date;
}

export type ActivityLogDocument = ActivityLog & Document;
export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });

