import { Controller, Post, Get, Body, Res, Req, UseGuards, UseInterceptors, HttpStatus, HttpCode } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from "./dto/auth.dto";
import { formatResponse } from "../../utils/formatResponse";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ActivityLogInterceptor } from "../../common/interceptors/activity-log.interceptor";
import { LogActivity } from "../../common/decorators/activity-log.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.register(dto);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return formatResponse(
      {
        user: result.user,
        token: result.token,
      },
      "User registered successfully"
    );
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const rawIp = req.headers["x-forwarded-for"] || req.ip || req.socket?.remoteAddress || "unknown";
    const ipAddress = typeof rawIp === "string" ? rawIp.split(",")[0].trim() : String(rawIp);

    const result = await this.authService.login(dto, ipAddress);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return formatResponse(
      {
        user: result.user,
        token: result.token,
      },
      "Logged in successfully"
    );
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("refreshToken");
    return formatResponse(null, "Logged out successfully");
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Body("refreshToken") bodyToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    
    const token = (req.cookies && req.cookies["refreshToken"]) || bodyToken;

    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED);
      return formatResponse(null, "Refresh token not found", "error");
    }

    const decoded = await this.authService.verifyRefreshToken(token);
    if (!decoded) {
      res.status(HttpStatus.UNAUTHORIZED);
      return formatResponse(null, "Invalid refresh token", "error");
    }

    const newToken = await this.authService.generateToken((decoded as any).userId);
    return formatResponse({ token: newToken }, "Token refreshed successfully");
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto.email);
    return formatResponse(null, result.message);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto.token, dto.newPassword);
    return formatResponse(null, result.message);
  }

  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body("token") token: string) {
    const result = await this.authService.verifyEmail(token);
    return formatResponse(null, result.message);
  }

  @Get("google")
  async googleAuth(@Res() res: Response) {
    const frontendUrl =
      process.env.FRONTEND_URL || "https://ai-resume-analyzer-cv-reviewer.vercel.app";
    try {
      const url = this.authService.getGoogleAuthUrl();
      return res.redirect(url);
    } catch (error: any) {
      console.error("[GoogleAuth] Error generating auth URL:", error.message);
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          error.message || "Google authentication is not yet configured on this server."
        )}`
      );
    }
  }

  @Get("google/callback")
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const frontendUrl =
      process.env.FRONTEND_URL || "https://ai-resume-analyzer-cv-reviewer.vercel.app";
    const code = req.query.code as string;
    const error = req.query.error as string;

    if (error || !code) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          error || "Google authorization was cancelled or failed."
        )}`
      );
    }

    try {
      const rawIp =
        req.headers["x-forwarded-for"] ||
        req.ip ||
        req.socket?.remoteAddress ||
        "unknown";
      const ipAddress =
        typeof rawIp === "string" ? rawIp.split(",")[0].trim() : String(rawIp);

      const result = await this.authService.handleGoogleCallback(code, ipAddress);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
    } catch (err: any) {
      console.error("[GoogleCallback] Error:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.error_description ||
        err.message ||
        "Failed to authenticate with Google.";
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(errorMsg)}`);
    }
  }

  @Get("github")
  async githubAuth(@Res() res: Response) {
    const frontendUrl =
      process.env.FRONTEND_URL || "https://ai-resume-analyzer-cv-reviewer.vercel.app";
    try {
      const url = this.authService.getGithubAuthUrl();
      return res.redirect(url);
    } catch (error: any) {
      console.error("[GithubAuth] Error generating auth URL:", error.message);
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          error.message || "GitHub authentication is not yet configured on this server."
        )}`
      );
    }
  }

  @Get("github/callback")
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const frontendUrl =
      process.env.FRONTEND_URL || "https://ai-resume-analyzer-cv-reviewer.vercel.app";
    const code = req.query.code as string;
    const error = req.query.error as string;

    if (error || !code) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          error || "GitHub authorization was cancelled or failed."
        )}`
      );
    }

    try {
      const rawIp =
        req.headers["x-forwarded-for"] ||
        req.ip ||
        req.socket?.remoteAddress ||
        "unknown";
      const ipAddress =
        typeof rawIp === "string" ? rawIp.split(",")[0].trim() : String(rawIp);

      const result = await this.authService.handleGithubCallback(code, ipAddress);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
    } catch (err: any) {
      console.error("[GithubCallback] Error:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.error_description ||
        err.message ||
        "Failed to authenticate with GitHub.";
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(errorMsg)}`);
    }
  }
}
