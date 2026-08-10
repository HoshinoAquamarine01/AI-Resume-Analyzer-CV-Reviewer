import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "../../models/User";
import { Resume, ResumeDocument } from "../../models/Resume";
import { Subscription, SubscriptionDocument } from "../../models/Subscription";
import { AdminLog, AdminLogDocument } from "../../models/AdminLog";
import redis from "../../config/db";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(AdminLog.name) private readonly logModel: Model<AdminLogDocument>
  ) {}

  async getDashboard() {
    const totalUsers = await this.userModel.countDocuments();
    const activeUsers = await this.userModel.countDocuments({ isActive: true });
    const totalResumes = await this.resumeModel.countDocuments();
    const totalSubscriptions = await this.subscriptionModel.countDocuments();
    const activeSubscriptions = await this.subscriptionModel.countDocuments({
      status: "active",
    });

    const revenueData = await this.subscriptionModel.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    return {
      totalUsers,
      activeUsers,
      totalResumes,
      totalSubscriptions,
      activeSubscriptions,
      monthlyRevenue: revenueData[0]?.total || 0,
    };
  }

  async manageUsers(adminId: string, action: string, userId?: string, status?: string, role?: string, page = 1, limit = 10) {
    if (action === "list") {
      const skip = (page - 1) * limit;
      const users = await this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .select("-password")
        .sort({ createdAt: -1 });

      const total = await this.userModel.countDocuments();
      return { users, total, pages: Math.ceil(total / limit) };
    }

    if (!userId) {
      throw new BadRequestException("userId is required for this action");
    }

    if (action === "deactivate") {
      const user = await this.userModel.findByIdAndUpdate(userId, { isActive: false });
      if (!user) throw new NotFoundException("User not found");
      await this.logModel.create({
        adminId: new Types.ObjectId(adminId),
        action: "USER_DEACTIVATED",
        targetUserId: new Types.ObjectId(userId),
      });
      return { message: "User deactivated successfully" };
    }

    if (action === "activate") {
      const user = await this.userModel.findByIdAndUpdate(userId, { isActive: true });
      if (!user) throw new NotFoundException("User not found");
      await this.logModel.create({
        adminId: new Types.ObjectId(adminId),
        action: "USER_ACTIVATED",
        targetUserId: new Types.ObjectId(userId),
      });
      return { message: "User activated successfully" };
    }

    if (action === "updateRole" && role) {
      const user = await this.userModel.findByIdAndUpdate(userId, { role });
      if (!user) throw new NotFoundException("User not found");
      await this.logModel.create({
        adminId: new Types.ObjectId(adminId),
        action: "ROLE_UPDATED",
        targetUserId: new Types.ObjectId(userId),
        details: JSON.stringify({ newRole: role }),
      });
      return { message: "User role updated successfully" };
    }

    throw new BadRequestException("Invalid action");
  }

  async getSetting(setting: string) {
    const redisKey = `admin:setting:${setting}`;
    const value = await redis.get(redisKey);
    return { [setting]: value };
  }

  async updateSetting(adminId: string, setting: string, value: any) {
    const redisKey = `admin:setting:${setting}`;
    await redis.set(redisKey, JSON.stringify(value));

    await this.logModel.create({
      adminId: new Types.ObjectId(adminId),
      action: "SETTING_UPDATED",
      details: JSON.stringify({ setting, value }),
    });

    return { message: "Setting updated successfully" };
  }

  async viewReports(type: string, startDate?: string, endDate?: string) {
    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (type === "resumes") {
      return this.resumeModel.find(query).populate("userId", "name email").sort({ createdAt: -1 });
    }

    if (type === "subscriptions") {
      return this.subscriptionModel.find(query).populate("userId", "name email").sort({ createdAt: -1 });
    }

    return this.logModel.find(query).populate("adminId", "name email").sort({ createdAt: -1 });
  }

  async viewAnalytics(period = "month") {
    let dateFilter = {};
    const now = new Date();

    if (period === "week") {
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
    } else if (period === "month") {
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    } else if (period === "year") {
      dateFilter = { $gte: new Date(now.getFullYear(), 0, 1) };
    }

    const userGrowth = await this.userModel.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const resumeCreated = await this.resumeModel.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topUsers = await this.resumeModel.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
    ]);

    return { userGrowth, resumeCreated, topUsers };
  }

  // Content, Roles, Permissions, Notifications, Integrations, Themes, Languages, Currencies, PaymentMethods
  async manageContent(action: string, contentId?: string, title?: string, body?: string, type?: string) {
    if (action === "create") {
      const content = { title, body, type, createdAt: new Date() };
      const redisKey = `content:${Date.now()}`;
      await redis.set(redisKey, JSON.stringify(content));
      return { id: redisKey };
    }

    if (action === "update" && contentId) {
      const content = { title, body, type, updatedAt: new Date() };
      await redis.set(contentId, JSON.stringify(content));
      return { message: "Content updated successfully" };
    }

    if (action === "delete" && contentId) {
      await redis.del(contentId);
      return { message: "Content deleted successfully" };
    }

    throw new BadRequestException("Invalid action");
  }

  async manageRoles(adminId: string, action: string, roleName: string, permissions: string[]) {
    const rolesKey = "admin:roles";
    let roles = JSON.parse((await redis.get(rolesKey)) || "[]");

    if (action === "create") {
      roles.push({ name: roleName, permissions, createdAt: new Date() });
    } else if (action === "update") {
      const index = roles.findIndex((r: any) => r.name === roleName);
      if (index !== -1) {
        roles[index] = { name: roleName, permissions, updatedAt: new Date() };
      }
    } else if (action === "delete") {
      roles = roles.filter((r: any) => r.name !== roleName);
    } else {
      throw new BadRequestException("Invalid action");
    }

    await redis.set(rolesKey, JSON.stringify(roles));

    await this.logModel.create({
      adminId: new Types.ObjectId(adminId),
      action: `ROLE_${action.toUpperCase()}`,
      details: JSON.stringify({ roleName, permissions }),
    });

    return roles;
  }

  async managePermissions(action: string, permissionName: string, resource?: string, actions?: string[]) {
    const permissionsKey = "admin:permissions";
    let permissions = JSON.parse((await redis.get(permissionsKey)) || "[]");

    if (action === "create") {
      permissions.push({
        name: permissionName,
        resource,
        actions,
        createdAt: new Date(),
      });
    } else if (action === "update") {
      const index = permissions.findIndex((p: any) => p.name === permissionName);
      if (index !== -1) {
        permissions[index] = {
          name: permissionName,
          resource,
          actions,
        };
      }
    } else if (action === "delete") {
      permissions = permissions.filter((p: any) => p.name !== permissionName);
    } else {
      throw new BadRequestException("Invalid action");
    }

    await redis.set(permissionsKey, JSON.stringify(permissions));
    return permissions;
  }

  async manageNotifications(action: string, userId?: string, title?: string, message?: string, type?: string) {
    if (action === "send" && userId) {
      const notification = {
        user: userId,
        title,
        message,
        type,
        read: false,
        createdAt: new Date(),
      };

      const notificationsKey = `notifications:${userId}`;
      const notifications = JSON.parse((await redis.get(notificationsKey)) || "[]");
      notifications.push(notification);
      await redis.set(notificationsKey, JSON.stringify(notifications));
      return { message: "Notification sent successfully" };
    }

    if (action === "broadcast") {
      const users = await this.userModel.find({ isActive: true });
      for (const user of users) {
        const notificationsKey = `notifications:${user._id}`;
        const notifications = JSON.parse((await redis.get(notificationsKey)) || "[]");
        notifications.push({
          title,
          message,
          type,
          read: false,
          createdAt: new Date(),
        });
        await redis.set(notificationsKey, JSON.stringify(notifications));
      }
      return { message: "Broadcast notification sent to all users" };
    }

    throw new BadRequestException("Invalid action");
  }

  async manageIntegrations(action: string, integrationName: string, apiKey?: string, apiSecret?: string, config?: any) {
    const integrationsKey = "admin:integrations";
    let integrations = JSON.parse((await redis.get(integrationsKey)) || "[]");

    if (action === "add") {
      integrations.push({
        name: integrationName,
        apiKey,
        apiSecret,
        config,
        enabled: true,
        createdAt: new Date(),
      });
    } else if (action === "update") {
      const index = integrations.findIndex((i: any) => i.name === integrationName);
      if (index !== -1) {
        integrations[index] = {
          ...integrations[index],
          apiKey: apiKey || integrations[index].apiKey,
          apiSecret: apiSecret || integrations[index].apiSecret,
          config: config || integrations[index].config,
        };
      }
    } else if (action === "toggle") {
      const integration = integrations.find((i: any) => i.name === integrationName);
      if (integration) {
        integration.enabled = !integration.enabled;
      }
    } else {
      throw new BadRequestException("Invalid action");
    }

    await redis.set(integrationsKey, JSON.stringify(integrations));
    return integrations;
  }

  async manageThemes(action: string, themeName: string, colors?: any, fonts?: any, layout?: any) {
    const themesKey = "admin:themes";
    let themes = JSON.parse((await redis.get(themesKey)) || "[]");

    if (action === "create") {
      themes.push({
        name: themeName,
        colors,
        fonts,
        layout,
        active: false,
        createdAt: new Date(),
      });
    } else if (action === "update") {
      const theme = themes.find((t: any) => t.name === themeName);
      if (theme) {
        theme.colors = colors || theme.colors;
        theme.fonts = fonts || theme.fonts;
        theme.layout = layout || theme.layout;
      }
    } else if (action === "activate") {
      themes.forEach((t: any) => (t.active = t.name === themeName));
    } else {
      throw new BadRequestException("Invalid action");
    }

    await redis.set(themesKey, JSON.stringify(themes));
    return themes;
  }

  async manageLanguages(action: string, languageCode: string, languageName?: string, translations?: any) {
    const languagesKey = "admin:languages";
    let languages = JSON.parse((await redis.get(languagesKey)) || "[]");

    if (action === "add") {
      languages.push({
        code: languageCode,
        name: languageName,
        translations,
        active: false,
      });
    } else if (action === "update") {
      const lang = languages.find((l: any) => l.code === languageCode);
      if (lang) {
        lang.name = languageName || lang.name;
        lang.translations = translations || lang.translations;
      }
    } else if (action === "activate") {
      languages.forEach((l: any) => (l.active = l.code === languageCode));
    } else {
      throw new BadRequestException("Invalid action");
    }

    await redis.set(languagesKey, JSON.stringify(languages));
    return languages;
  }

  async manageCurrencies(action: string, currencyCode: string, currencyName?: string, symbol?: string, exchangeRate?: number) {
    const currenciesKey = "admin:currencies";
    let currencies = JSON.parse((await redis.get(currenciesKey)) || "[]");

    if (action === "add") {
      currencies.push({
        code: currencyCode,
        name: currencyName,
        symbol,
        exchangeRate,
        active: false,
      });
    } else if (action === "update") {
      const curr = currencies.find((c: any) => c.code === currencyCode);
      if (curr) {
        curr.exchangeRate = exchangeRate || curr.exchangeRate;
        curr.symbol = symbol || curr.symbol;
      }
    } else if (action === "activate") {
      currencies.forEach((c: any) => (c.active = c.code === currencyCode));
    } else {
      throw new BadRequestException("Invalid action");
    }

    await redis.set(currenciesKey, JSON.stringify(currencies));
    return currencies;
  }

  async managePaymentMethods(action: string, methodName: string, config?: any, enabled?: boolean) {
    const paymentMethodsKey = "admin:paymentMethods";
    let paymentMethods = JSON.parse((await redis.get(paymentMethodsKey)) || "[]");

    if (action === "add") {
      paymentMethods.push({
        name: methodName,
        config,
        enabled: true,
        createdAt: new Date(),
      });
    } else if (action === "update") {
      const method = paymentMethods.find((m: any) => m.name === methodName);
      if (method) {
        method.config = config || method.config;
        method.enabled = enabled !== undefined ? enabled : method.enabled;
      }
    } else if (action === "remove") {
      paymentMethods = paymentMethods.filter((m: any) => m.name !== methodName);
    } else {
      throw new BadRequestException("Invalid action");
    }

    await redis.set(paymentMethodsKey, JSON.stringify(paymentMethods));
    return paymentMethods;
  }
}
