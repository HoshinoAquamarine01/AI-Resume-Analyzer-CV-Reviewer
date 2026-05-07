import mongoose, { Document, Schema } from "mongoose";
export interface IAdminLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetUserId?: mongoose.Types.ObjectId;
  details?: string;

  createdAt: Date;
}
const AdminLogSchema = new Schema<IAdminLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    details: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const AdminLog = mongoose.model<IAdminLog>("AdminLog", AdminLogSchema);
