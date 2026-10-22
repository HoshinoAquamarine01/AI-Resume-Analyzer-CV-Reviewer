import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../../models/User";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import { sendEmail, sendActivationEmail, sendOtpResetPasswordEmail } from "../../services/email.service";

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

    const createdUser = await this.userModel.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
    });

    const token = await this.generateToken(createdUser._id, createdUser.role);
    const refreshToken = await this.generateRefreshToken(createdUser._id);

    try {
      const emailToken = jwt.sign({ userId: createdUser._id }, process.env.EMAIL_TOKEN_SECRET || "secret", { expiresIn: "24h" });
      const activationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/verify-email?token=${emailToken}`;
      await sendActivationEmail(createdUser.email, activationUrl, createdUser.name);
    } catch (err) {
      console.error("[AuthService] Failed to send activation email:", err);
    }

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

    const token = await this.generateToken(user._id, user.role);
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

  async generateToken(userId: any, role: string = "user"): Promise<string> {
    return jwt.sign(
      { userId, id: userId, sub: userId, role },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "24h",
      }
    );
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
      
      return { message: "If email exists, password reset link will be sent" };
    }

    const resetToken = await this.generatePasswordResetToken(user._id);
    await sendOtpResetPasswordEmail(user.email, resetToken, user.name);

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

  getGoogleAuthUrl(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new BadRequestException("Google Client ID is not configured on the server. Please set GOOGLE_CLIENT_ID in .env");
    }

    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL ||
      (process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/auth/google/callback`
        : "https://ai-resume-analyzer-cv-reviewer.vercel.app/api/auth/google/callback");

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: callbackUrl,
      client_id: clientId,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  }

  async handleGoogleCallback(code: string, ipAddress?: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL ||
      (process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/auth/google/callback`
        : "https://ai-resume-analyzer-cv-reviewer.vercel.app/api/auth/google/callback");

    if (!clientId || !clientSecret) {
      throw new BadRequestException("Google OAuth credentials are not configured on the server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env");
    }

    
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

   
    const userinfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { sub: googleId, email, name, picture } = userinfoResponse.data;

    if (!email) {
      throw new BadRequestException("Unable to retrieve email from Google account");
    }

   
    let user = await this.userModel.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    });

    if (user) {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.avatarUrl && picture) {
        user.avatarUrl = picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      user = await this.userModel.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        googleId,
        avatarUrl: picture,
        authProvider: "google",
        isActive: true,
      });
    }

    const token = await this.generateToken(user._id, user.role);
    const refreshToken = await this.generateRefreshToken(user._id);

    try {
      await this.activityLogService.createLog(
        user._id,
        "login",
        { provider: "google" },
        ipAddress || "unknown"
      );
    } catch {
   
    }

      return {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        token,
        refreshToken,
      };
    }

  getGithubAuthUrl(): string {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      throw new BadRequestException("GitHub Client ID is not configured on the server. Please set GITHUB_CLIENT_ID in .env");
    }

    const callbackUrl =
      process.env.GITHUB_CALLBACK_URL ||
      (process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/auth/github/callback`
        : "https://ai-resume-analyzer-cv-reviewer.vercel.app/api/auth/github/callback");

    const rootUrl = "https://github.com/login/oauth/authorize";
    const options = {
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: "read:user user:email",
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  }

  async handleGithubCallback(code: string, ipAddress?: string) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const callbackUrl =
      process.env.GITHUB_CALLBACK_URL ||
      (process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/auth/github/callback`
        : "https://ai-resume-analyzer-cv-reviewer.vercel.app/api/auth/github/callback");

    if (!clientId || !clientSecret) {
      throw new BadRequestException("GitHub OAuth credentials are not configured on the server. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env");
    }


    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token, error, error_description } = tokenResponse.data;
    if (error || !access_token) {
      throw new BadRequestException(error_description || "Failed to exchange GitHub authorization code.");
    }

    const userinfoResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "User-Agent": "ResumeIQ-AI",
      },
    });

    const { id: githubId, login, name, avatar_url } = userinfoResponse.data;
    let email = userinfoResponse.data.email;

   
    if (!email) {
      try {
        const emailsResponse = await axios.get("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "User-Agent": "ResumeIQ-AI",
          },
        });
        const emails = emailsResponse.data || [];
        const primary = emails.find((e: any) => e.primary && e.verified);
        email = primary?.email || emails.find((e: any) => e.verified)?.email || emails[0]?.email;
      } catch (err: any) {
        console.warn("[GitHubAuth] Failed to fetch user emails:", err.message);
      }
    }

    if (!email) {
      email = `${login}@users.noreply.github.com`;
    }

  
    const stringGithubId = String(githubId);
    let user = await this.userModel.findOne({
      $or: [{ githubId: stringGithubId }, { email: email.toLowerCase() }],
    });

    if (user) {
      let updated = false;
      if (!user.githubId) {
        user.githubId = stringGithubId;
        updated = true;
      }
      if (!user.avatarUrl && avatar_url) {
        user.avatarUrl = avatar_url;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      user = await this.userModel.create({
        name: name || login || email.split("@")[0],
        email: email.toLowerCase(),
        githubId: stringGithubId,
        avatarUrl: avatar_url,
        authProvider: "github",
        isActive: true,
      });
    }

    const token = await this.generateToken(user._id, user.role);
    const refreshToken = await this.generateRefreshToken(user._id);

    try {
      await this.activityLogService.createLog(
        user._id,
        "login",
        { provider: "github" },
        ipAddress || "unknown"
      );
    } catch {
   
    }

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      token,
      refreshToken,
    };
  }
}
