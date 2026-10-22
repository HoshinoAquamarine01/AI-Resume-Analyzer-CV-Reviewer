import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as fs from "fs";
import * as path from "path";
import { User, UserDocument } from "../../models/User";
import { Resume, ResumeDocument } from "../../models/Resume";
import { Subscription, SubscriptionDocument } from "../../models/Subscription";
import { AdminLog, AdminLogDocument } from "../../models/AdminLog";
import { InterviewSession, InterviewSessionDocument } from "../../models/InterviewSession";
import { sendEmail } from "../../services/email.service";
import redis from "../../config/db";

@Injectable()
export class JobsService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(AdminLog.name) private readonly logModel: Model<AdminLogDocument>,
    @InjectModel(InterviewSession.name) private readonly sessionModel: Model<InterviewSessionDocument>
  ) {}

  async onApplicationBootstrap() {
    if (process.env.VERCEL) {
      console.log("[Jobs Orchestrator] Skipping initial background jobs on serverless cold start.");
      return;
    }
    console.log("[Jobs Orchestrator] Running initial jobs execution on startup...");
    await this.runSubscriptionJob().catch((err) => console.error("Initial Subscription job failed:", err));
    await this.runCleanupJob().catch((err) => console.error("Initial Cleanup job failed:", err));
    await this.runEmailReminderJob().catch((err) => console.error("Initial Email reminder job failed:", err));
    await this.runAnalyticsJob().catch((err) => console.error("Initial Analytics job failed:", err));
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async runSubscriptionJob() {
    console.log("[Subscription Job] Checking for expired subscriptions...");
    try {
      const now = new Date();
      const expiredSubscriptions = await this.subscriptionModel.find({
        endDate: { $lt: now },
        status: "active",
      });

      if (expiredSubscriptions.length === 0) {
        console.log("[Subscription Job] No newly expired subscriptions found.");
        return;
      }

      console.log(`[Subscription Job] Found ${expiredSubscriptions.length} expired subscription(s). Updating status to 'expired'...`);

      for (const sub of expiredSubscriptions) {
        sub.status = "expired";
        await sub.save();
        console.log(`[Subscription Job] Subscription ${sub._id} for user ${sub.userId} has been marked as expired.`);
      }
      console.log("[Subscription Job] Expired subscriptions update complete.");
    } catch (err) {
      console.error("[Subscription Job] Error running subscription check:", err);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async runCleanupJob() {
    console.log("[Cleanup Job] Running system cleanup...");
    try {
      
      const resumeUploadsDir = path.join(process.cwd(), "uploads", "resumes");
      if (fs.existsSync(resumeUploadsDir)) {
        const files = await fs.promises.readdir(resumeUploadsDir);
        const activeResumes = await this.resumeModel.find().select("fileUrl");
        
        const activeFilenames = new Set(
          activeResumes
            .map((r) => r.fileUrl ? path.basename(r.fileUrl) : "")
            .filter(Boolean)
        );

        let filesDeleted = 0;
        for (const file of files) {
          if (file.startsWith(".")) continue;

          if (!activeFilenames.has(file)) {
            const filePath = path.join(resumeUploadsDir, file);
            await fs.promises.unlink(filePath);
            filesDeleted++;
          }
        }
        console.log(`[Cleanup Job] Cleaned up ${filesDeleted} orphaned resume file(s).`);
      }

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const subCleanupResult = await this.subscriptionModel.deleteMany({
        paymentStatus: "failed",
        createdAt: { $lt: thirtyDaysAgo },
      });
      console.log(`[Cleanup Job] Deleted ${subCleanupResult.deletedCount} failed subscription record(s) older than 30 days.`);

      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const logsCleanupResult = await this.logModel.deleteMany({
        createdAt: { $lt: ninetyDaysAgo },
      });
      console.log(`[Cleanup Job] Deleted ${logsCleanupResult.deletedCount} admin log(s) older than 90 days.`);

      console.log("[Cleanup Job] System cleanup complete.");
    } catch (err) {
      console.error("[Cleanup Job] Error running system cleanup:", err);
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async runEmailReminderJob() {
    console.log("[Email Reminder Job] Checking for user reminder triggers...");
    try {
      const now = new Date();

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const usersWithNoResume = await this.userModel.find({
        createdAt: { $lt: twentyFourHoursAgo },
        $or: [
          { resumeIds: { $exists: false } },
          { resumeIds: { $size: 0 } }
        ]
      });

      for (const user of usersWithNoResume) {
        await sendEmail(
          user.email,
          "Unlock your career potential with ResumeIQ-AI!",
          `Hi ${user.name},\n\nWe noticed you haven't uploaded a resume yet. Upload your resume today to get an AI-powered ATS compatibility score and key improvement recommendations!\n\nBest,\nThe ResumeIQ-AI Team`
        );
      }
      console.log(`[Email Reminder Job] Sent resume upload reminders to ${usersWithNoResume.length} user(s).`);

      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const expiringSoonSubscriptions = await this.subscriptionModel.find({
        endDate: { $gt: now, $lt: threeDaysFromNow },
        status: "active",
      }).populate("userId");

      let expiryWarningsSent = 0;
      for (const sub of expiringSoonSubscriptions) {
        const user = sub.userId as any;
        if (user && user.email) {
          await sendEmail(
            user.email,
            `Your ResumeIQ-AI ${sub.plan.toUpperCase()} Plan is Expiring Soon`,
            `Hi ${user.name},\n\nYour premium subscription plan (${sub.plan.toUpperCase()}) is scheduled to expire on ${sub.endDate?.toLocaleDateString() || ""}.\n\nRenew your subscription now to maintain uninterrupted access to all ATS optimizations and mock interview tools!\n\nBest,\nThe ResumeIQ-AI Team`
          );
          expiryWarningsSent++;
        }
      }
      console.log(`[Email Reminder Job] Sent expiration warnings to ${expiryWarningsSent} user(s).`);

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentSessions = await this.sessionModel.find({
        createdAt: { $gte: sevenDaysAgo },
      }).select("userId");

      const recentUserIds = new Set(recentSessions.map((s) => s.userId.toString()));
      const usersNeedPractice = await this.userModel.find({
        _id: { $nin: Array.from(recentUserIds).map(id => new Types.ObjectId(id)) },
      });

      for (const user of usersNeedPractice) {
        await sendEmail(
          user.email,
          "Stay sharp! Practice your interview questions today",
          `Hi ${user.name},\n\nConsistent practice is the key to mastering your next job interview. It has been over a week since your last AI-powered mock interview session.\n\nTake 10 minutes today to generate new questions and practice your answers!\n\nBest,\nThe ResumeIQ-AI Team`
        );
      }
      console.log(`[Email Reminder Job] Sent interview practice reminders to ${usersNeedPractice.length} user(s).`);

      console.log("[Email Reminder Job] Reminder checks complete.");
    } catch (err) {
      console.error("[Email Reminder Job] Error running email reminder checks:", err);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async runAnalyticsJob() {
    console.log("[Analytics Job] Pre-calculating system metrics...");
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const totalUsers = await this.userModel.countDocuments();
      const newUsersLast30Days = await this.userModel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      });

      const totalResumes = await this.resumeModel.countDocuments();
      const newResumesLast30Days = await this.resumeModel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      });

      const activeSubscriptions = await this.subscriptionModel.countDocuments({
        status: "active",
      });

      const revenueData = await this.subscriptionModel.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]);
      const monthlyRevenue = revenueData[0]?.total || 0;

      const userGrowth = await this.userModel.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const statsSummary = {
        summary: {
          totalUsers,
          newUsersLast30Days,
          totalResumes,
          newResumesLast30Days,
          activeSubscriptions,
          monthlyRevenue,
        },
        userGrowth,
        calculatedAt: new Date().toISOString(),
      };

      await redis.set("admin:stats:summary", JSON.stringify(statsSummary));
      console.log(`[Analytics Job] System metrics cached. Total Users: ${totalUsers}, Revenue: $${monthlyRevenue}`);
    } catch (err) {
      console.error("[Analytics Job] Error calculating analytics:", err);
    }
  }
}
