import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as fs from "fs";
import * as path from "path";
import { User, UserDocument } from "../../models/User";
import { Resume, ResumeDocument } from "../../models/Resume";
import { CoverLetter, CoverLetterDocument } from "../../models/CoverLetter";
import { InterviewSession, InterviewSessionDocument } from "../../models/InterviewSession";
import { ResumeAnalysis, ResumeAnalysisDocument } from "../../models/ResumeAnalysis";
import { JobMatch, JobMatchDocument } from "../../models/JobMatch";
import { Subscription, SubscriptionDocument } from "../../models/Subscription";
import { ActivityLog, ActivityLogDocument } from "../../models/ActivityLog";
import { UpdateProfileDto, UpdateSettingsDto } from "./dto/user.dto";
import { ActivityLogService } from "../activity-log/activity-log.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>,
    @InjectModel(CoverLetter.name) private coverLetterModel: Model<CoverLetterDocument>,
    @InjectModel(InterviewSession.name) private interviewModel: Model<InterviewSessionDocument>,
    @InjectModel(ResumeAnalysis.name) private analysisModel: Model<ResumeAnalysisDocument>,
    @InjectModel(JobMatch.name) private jobMatchModel: Model<JobMatchDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>,
    private readonly activityLogService: ActivityLogService
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select("-password");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        name: dto.name,
        phoneNumber: dto.phone,
        bio: dto.bio,
        targetRole: dto.targetRole,
        avatarUrl: dto.avatar,
        location: dto.location,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    return updatedUser;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { avatarUrl },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    return updatedUser;
  }

  private deletePhysicalFile(fileUrl?: string) {
    if (!fileUrl) return;
    try {
      if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
        return;
      }
      const cleanRelativePath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
      const absolutePath = path.isAbsolute(cleanRelativePath)
        ? cleanRelativePath
        : path.join(process.cwd(), cleanRelativePath);

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`[UserService] Deleted physical file: ${absolutePath}`);
      }
    } catch (err) {
      console.error(`[UserService] Failed to delete physical file: ${fileUrl}`, err);
    }
  }

  async deleteAccount(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const resumes = await this.resumeModel.find({ userId: userObjectId });
    for (const resume of resumes) {
      this.deletePhysicalFile(resume.fileUrl);
    }

    const interviewSessions = await this.interviewModel.find({ userId: userObjectId });
    for (const session of interviewSessions) {
      this.deletePhysicalFile(session.videoUrl);
      this.deletePhysicalFile(session.audioUrl);
    }

    if (user.avatarUrl) {
      this.deletePhysicalFile(user.avatarUrl);
    }

    await Promise.all([
      this.resumeModel.deleteMany({ userId: userObjectId }),
      this.coverLetterModel.deleteMany({ userId: userObjectId }),
      this.interviewModel.deleteMany({ userId: userObjectId }),
      this.analysisModel.deleteMany({ userId: userObjectId }),
      this.jobMatchModel.deleteMany({ userId: userObjectId }),
      this.subscriptionModel.deleteMany({ userId: userObjectId }),
      this.activityLogModel.deleteMany({ userId: userObjectId }),
    ]);

    await this.userModel.findByIdAndDelete(userId);

    return { message: "Account and associated data deleted successfully" };
  }

  async getSettings(userId: string) {
    const user = await this.userModel.findById(userId).select(
      "name email phoneNumber avatarUrl linkedInUrl githubUrl"
    );
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        name: dto.name,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        avatarUrl: dto.avatarUrl,
        linkedInUrl: dto.linkedInUrl,
        githubUrl: dto.githubUrl,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    return updatedUser;
  }

  async getActivityLog(userId: string, page = 1, limit = 10) {
    return this.activityLogService.getActivityLogs(userId, page, limit);
  }

  async getSubscription(userId: string) {
    const user = await this.userModel.findById(userId).populate("subscriptionId");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user.subscriptionId || null;
  }

  async getReferrals(userId: string) {
    const referrals = await this.userModel.find({ referredBy: userId as any }).select(
      "name email createdAt"
    );
    return { referrals, count: referrals.length };
  }

  async generateReferralLink(userId: string) {
    const referralCode = Buffer.from(userId).toString("base64");
    const referralLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/register?ref=${referralCode}`;
    return { referralCode, referralLink };
  }
}
