import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ActivityLog, ActivityLogDocument } from "../../models/ActivityLog";

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLogDocument>
  ) {}

  /**
   * Automatically creates an ActivityLog record in MongoDB
   */
  async createLog(
    userId: string | Types.ObjectId,
    action: string,
    details?: Record<string, unknown>,
    ipAddress?: string
  ): Promise<ActivityLogDocument | null> {
    try {
      if (!userId) return null;
      return await this.activityLogModel.create({
        userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId,
        action,
        details: details || {},
        ipAddress: ipAddress || "unknown",
      });
    } catch (error) {
      console.error("Failed to create activity log record:", error);
      return null;
    }
  }

  /**
   * Retrieves paginated activity logs for a specific user
   */
  async getActivityLogs(userId: string, page = 1, limit = 10) {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;
    const userObjectId = new Types.ObjectId(userId);

    const [activity, total] = await Promise.all([
      this.activityLogModel
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .exec(),
      this.activityLogModel.countDocuments({ userId: userObjectId }),
    ]);

    return {
      activity,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    };
  }
}
