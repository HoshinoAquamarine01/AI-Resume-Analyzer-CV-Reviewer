import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../../models/User";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { sendEmail } from "../../services/email.service";

import { ActivityLogService } from "../activity-log/activity-log.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly activityLogService: ActivityLogService
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException("Email already registered");
    }

    // Save the user in MongoDB. Schema pre-save hook will hash the password.
    const createdUser = await this.userModel.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
    });

    const token = await this.generateToken(createdUser._id);
    const refreshToken = await this.generateRefreshToken(createdUser._id);

    return {
      user: {
        _id: createdUser._id,
        email: createdUser.email,
        name: createdUser.name,
        phoneNumber: createdUser.phoneNumber,
      },
      token,
      refreshToken,
    };
  }

  async login(dto: LoginDto, ipAddress?: string) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const token = await this.generateToken(user._id);
    const refreshToken = await this.generateRefreshToken(user._id);

    await this.activityLogService.createLog(
      user._id,
      "LOGIN",
      { email: dto.email },
      ipAddress
    );

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  async generateToken(userId: any): Promise<string> {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
      expiresIn: "24h",
    });
  }

  async generateRefreshToken(userId: any): Promise<string> {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || "secret", {
      expiresIn: "7d",
    });
  }

  async verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "secret");
    } catch {
      return null;
    }
  }

  async verifyEmailToken(token: string) {
    try {
      return jwt.verify(token, process.env.EMAIL_TOKEN_SECRET || "secret");
    } catch {
      return null;
    }
  }

  async generatePasswordResetToken(userId: any): Promise<string> {
    return jwt.sign({ userId }, process.env.RESET_TOKEN_SECRET || "secret", {
      expiresIn: "1h",
    });
  }

  async verifyPasswordResetToken(token: string) {
    try {
      return jwt.verify(token, process.env.RESET_TOKEN_SECRET || "secret");
    } catch {
      return null;
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Return same response to prevent user enumeration
      return { message: "If email exists, password reset link will be sent" };
    }

    const resetToken = await this.generatePasswordResetToken(user._id);
    await sendEmail(
      email,
      "Password Reset Request",
      `To reset your password, please use the following token: ${resetToken}`
    );

    return { message: "Password reset link sent to your email" };
  }

  async resetPassword(token: string, newPassword: string) {
    const decoded = await this.verifyPasswordResetToken(token);
    if (!decoded) {
      throw new BadRequestException("Invalid token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate((decoded as any).userId, {
      password: hashedPassword,
    });

    return { message: "Password reset successfully" };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await user.comparePassword(dto.currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return { message: "Password changed successfully" };
  }

  async verifyEmail(token: string) {
    const decoded = await this.verifyEmailToken(token);
    if (!decoded) {
      throw new BadRequestException("Invalid token");
    }

    await this.userModel.findByIdAndUpdate((decoded as any).userId, {
      emailVerified: true,
    });

    return { message: "Email verified successfully" };
  }
}
