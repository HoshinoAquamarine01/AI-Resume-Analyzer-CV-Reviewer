import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../../models/User";
import { UpdateProfileDto, UpdateSettingsDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
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

  async deleteAccount(userId: string) {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException("User not found");
    }
    return { message: "Account deleted" };
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

  async getActivityLog(userId: string) {
    return { activity: [] };
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
