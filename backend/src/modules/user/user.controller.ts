import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { UpdateProfileDto, UpdateSettingsDto } from "./dto/user.dto";
import { ChangePasswordDto } from "../auth/dto/auth.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UserDec } from "../../common/decorators/user.decorator";
import { formatResponse } from "../../utils/formatResponse";

import { CloudStorageService } from "../../common/services/cloud-storage.service";

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly cloudStorageService: CloudStorageService
  ) {}

  @Get("profile")
  async getProfile(@UserDec() user: any) {
    const profile = await this.userService.getProfile(user._id);
    return formatResponse(profile, "Profile retrieved");
  }

  @Put("profile")
  async updateProfile(@UserDec() user: any, @Body() dto: UpdateProfileDto) {
    const updated = await this.userService.updateProfile(user._id, dto);
    return formatResponse(updated, "Profile updated");
  }

  @Post("avatar")
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(process.cwd(), "uploads", "avatars");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          cb(null, `${name}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Invalid file type: ${file.mimetype}`), false);
        }
      },
    })
  )
  async uploadAvatar(
    @UserDec() user: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }
    const uploaded = await this.cloudStorageService.uploadFile(file, "avatars");
    const updated = await this.userService.updateAvatar(user._id, uploaded.url);
    return formatResponse(updated, "Avatar uploaded");
  }

  @Post("avatar/url")
  async updateAvatarUrl(
    @UserDec() user: any,
    @Body("avatarUrl") avatarUrl: string
  ) {
    if (!avatarUrl) {
      throw new BadRequestException("avatarUrl must be a valid URL");
    }
    const updated = await this.userService.updateAvatar(user._id, avatarUrl);
    return formatResponse(updated, "Avatar updated");
  }

  @Post("change-password")
  async changePassword(@UserDec() user: any, @Body() dto: ChangePasswordDto) {
    const result = await this.authService.changePassword(user._id, dto);
    return formatResponse(null, result.message);
  }

  @Delete("account")
  async deleteAccount(@UserDec() user: any) {
    const result = await this.userService.deleteAccount(user._id);
    return formatResponse(null, result.message);
  }

  @Get("settings")
  async getSettings(@UserDec() user: any) {
    const settings = await this.userService.getSettings(user._id);
    return formatResponse(settings, "Settings retrieved");
  }

  @Put("settings")
  async updateSettings(@UserDec() user: any, @Body() dto: UpdateSettingsDto) {
    const updated = await this.userService.updateSettings(user._id, dto);
    return formatResponse(updated, "Settings updated");
  }

  @Get("activity-log")
  async getActivityLog(
    @UserDec() user: any,
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    const logs = await this.userService.getActivityLog(user._id, Number(page), Number(limit));
    return formatResponse(logs, "Activity log retrieved");
  }

  @Get("subscription")
  async getSubscription(@UserDec() user: any) {
    const subscription = await this.userService.getSubscription(user._id);
    return formatResponse(subscription, "Subscription retrieved");
  }

  @Get("referrals")
  async getReferrals(@UserDec() user: any) {
    const referrals = await this.userService.getReferrals(user._id);
    return formatResponse(referrals, "Referrals retrieved");
  }

  @Post("referrals/link")
  async generateReferralLink(@UserDec() user: any) {
    const linkData = await this.userService.generateReferralLink(user._id);
    return formatResponse(linkData, "Referral link generated");
  }
}
