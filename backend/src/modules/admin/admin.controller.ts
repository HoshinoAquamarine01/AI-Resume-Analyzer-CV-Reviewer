import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserDec } from "../../common/decorators/user.decorator";
import { formatResponse } from "../../utils/formatResponse";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  async getAdminDashboard() {
    const data = await this.adminService.getDashboard();
    return formatResponse(data, "Dashboard data retrieved successfully");
  }

  @Get("financial-analytics")
  async getFinancialAnalytics(@Query("period") period = "month") {
    const analytics = await this.adminService.getFinancialAnalytics(period as any);
    return formatResponse(analytics, "Financial analytics retrieved successfully");
  }

  @Get("users/:id")
  async getUserDetail(@Param("id") id: string) {
    const data = await this.adminService.getUserDetail(id);
    return formatResponse(data, "User details retrieved successfully");
  }

  @Put("users/:id")
  async updateUserDetail(
    @UserDec() admin: any,
    @Param("id") id: string,
    @Body() body: any
  ) {
    const data = await this.adminService.updateUserDetail(admin._id, id, body);
    return formatResponse(data, "User details updated successfully");
  }

  @Post("users/manage")
  @HttpCode(HttpStatus.OK)
  async manageUsers(
    @UserDec() admin: any,
    @Body("action") action: string,
    @Body("userId") userId?: string,
    @Body("status") status?: string,
    @Body("role") role?: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    const result = await this.adminService.manageUsers(
      admin._id,
      action,
      userId,
      status,
      role,
      Number(page),
      Number(limit)
    );
    return formatResponse(result, "Users managed successfully");
  }

  @Get("logs")
  async getAdminLogs(
    @Query("type") type: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    const reports = await this.adminService.viewReports(type, startDate, endDate);
    return formatResponse(reports, "Admin reports/logs retrieved");
  }

  @Put("settings")
  async updateSystemSettings(
    @UserDec() admin: any,
    @Body("setting") setting: string,
    @Body("value") value: any
  ) {
    const result = await this.adminService.updateSetting(admin._id, setting, value);
    return formatResponse(null, result.message);
  }

  @Get("settings")
  async getSystemSetting(@Query("setting") setting: string) {
    const value = await this.adminService.getSetting(setting);
    return formatResponse(value, "Setting retrieved");
  }

  @Get("stats")
  async getSystemStats(@Query("period") period = "month") {
    const stats = await this.adminService.viewAnalytics(period);
    return formatResponse(stats, "Analytics retrieved successfully");
  }

  @Post("content")
  async manageContent(
    @Body("action") action: string,
    @Body("contentId") contentId?: string,
    @Body("title") title?: string,
    @Body("body") body?: string,
    @Body("type") type?: string
  ) {
    const result = await this.adminService.manageContent(action, contentId, title, body, type);
    return formatResponse(result, `Content ${action}ed successfully`);
  }

  @Post("roles")
  async manageRoles(
    @UserDec() admin: any,
    @Body("action") action: string,
    @Body("roleName") roleName: string,
    @Body("permissions") permissions: string[]
  ) {
    const result = await this.adminService.manageRoles(admin._id, action, roleName, permissions);
    return formatResponse(result, `Role ${action}d successfully`);
  }

  @Post("permissions")
  async managePermissions(
    @Body("action") action: string,
    @Body("permissionName") permissionName: string,
    @Body("resource") resource?: string,
    @Body("actions") actions?: string[]
  ) {
    const result = await this.adminService.managePermissions(action, permissionName, resource, actions);
    return formatResponse(result, `Permission ${action}d successfully`);
  }

  @Post("notifications")
  async manageNotifications(
    @Body("action") action: string,
    @Body("userId") userId?: string,
    @Body("title") title?: string,
    @Body("message") message?: string,
    @Body("type") type?: string
  ) {
    const result = await this.adminService.manageNotifications(action, userId, title, message, type);
    return formatResponse(result, "Notification operation successful");
  }

  @Post("integrations")
  async manageIntegrations(
    @Body("action") action: string,
    @Body("integrationName") integrationName: string,
    @Body("apiKey") apiKey?: string,
    @Body("apiSecret") apiSecret?: string,
    @Body("config") config?: any
  ) {
    const result = await this.adminService.manageIntegrations(action, integrationName, apiKey, apiSecret, config);
    return formatResponse(result, `Integration ${action}ed successfully`);
  }

  @Post("themes")
  async manageThemes(
    @Body("action") action: string,
    @Body("themeName") themeName: string,
    @Body("colors") colors?: any,
    @Body("fonts") fonts?: any,
    @Body("layout") layout?: any
  ) {
    const result = await this.adminService.manageThemes(action, themeName, colors, fonts, layout);
    return formatResponse(result, `Theme ${action}d successfully`);
  }

  @Post("languages")
  async manageLanguages(
    @Body("action") action: string,
    @Body("languageCode") languageCode: string,
    @Body("languageName") languageName?: string,
    @Body("translations") translations?: any
  ) {
    const result = await this.adminService.manageLanguages(action, languageCode, languageName, translations);
    return formatResponse(result, `Language ${action}ed successfully`);
  }

  @Post("currencies")
  async manageCurrencies(
    @Body("action") action: string,
    @Body("currencyCode") currencyCode: string,
    @Body("currencyName") currencyName?: string,
    @Body("symbol") symbol?: string,
    @Body("exchangeRate") exchangeRate?: number
  ) {
    const result = await this.adminService.manageCurrencies(action, currencyCode, currencyName, symbol, exchangeRate);
    return formatResponse(result, `Currency ${action}ed successfully`);
  }

  @Post("payment-methods")
  async managePaymentMethods(
    @Body("action") action: string,
    @Body("methodName") methodName: string,
    @Body("config") config?: any,
    @Body("enabled") enabled?: boolean
  ) {
    const result = await this.adminService.managePaymentMethods(action, methodName, config, enabled);
    return formatResponse(result, `Payment method ${action}ed successfully`);
  }
}
