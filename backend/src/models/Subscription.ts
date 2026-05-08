import mongoose, { Schema, Document } from "mongoose";
export interface Subscription extends Document {
  userId: mongoose.Types.ObjectId;

  plan: "free" | "pro" | "premium";

  price: number;

  startDate: Date;
  endDate: Date;

  features: string[];

  paymentStatus: "pending" | "paid" | "failed";

  stripeCustomerId?: string;

  createdAt: Date;
}
const SubscriptionSchema = new Schema<Subscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },

    price: Number,

    startDate: Date,
    endDate: Date,

    features: [String],

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
    },

    stripeCustomerId: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
const Subscription = mongoose.model<Subscription>(
  "Subscription",
  SubscriptionSchema,
);

export { Subscription };
