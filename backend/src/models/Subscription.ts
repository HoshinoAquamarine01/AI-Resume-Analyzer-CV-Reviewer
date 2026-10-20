import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Subscription extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  })
  plan: "free" | "pro" | "premium";

  @Prop()
  price?: number;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ type: [String] })
  features?: string[];

  @Prop({
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active",
  })
  status: "active" | "expired" | "cancelled";

  @Prop({
    type: String,
    enum: ["pending", "paid", "failed"],
  })
  paymentStatus?: "pending" | "paid" | "failed";

  @Prop()
  transferContent?: string;

  @Prop()
  userConfirmedAt?: Date;

  @Prop()
  stripeCustomerId?: string;

  createdAt: Date;
}

export type SubscriptionDocument = Subscription & Document;
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
