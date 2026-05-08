import { User } from "../models/User";
import { Resume } from "../models/Resume";
import { AdminLog } from "../models/AdminLog";
import { Subscription } from "../models/Subscription";
import { asyncHandler } from "../utils/asyncHandler";
import { formatResponse } from "../utils/formatResponse";

export const getAdminDashboard = asyncHandler(async (req: any, res: any) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const totalResumes = await Resume.countDocuments();
  const totalSubscriptions = await Subscription.countDocuments();
  const activeSubscriptions = await Subscription.countDocuments({
    status: "active",
  });

  const revenueData = await Subscription.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  const dashboardData = {
    totalUsers,
    activeUsers,
    totalResumes,
    totalSubscriptions,
    activeSubscriptions,
    monthlyRevenue: revenueData[0]?.total || 0,
  };

  return res
    .status(200)
    .json(
      formatResponse(dashboardData, "Dashboard data retrieved successfully"),
    );
});

export const manageUsers = asyncHandler(async (req: any, res: any) => {
  const { action, userId, status, role } = req.body;

  if (action === "list") {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select("-password")
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return res
      .status(200)
      .json(
        formatResponse(
          { users, total, pages: Math.ceil(total / limit) },
          "Users retrieved successfully",
        ),
      );
  }

  if (action === "deactivate" && userId) {
    await User.findByIdAndUpdate(userId, { isActive: false });
    await AdminLog.create({
      adminId: req.user._id,
      action: "USER_DEACTIVATED",
      targetUserId: userId,
    });
    return res
      .status(200)
      .json(formatResponse(null, "User deactivated successfully"));
  }

  if (action === "activate" && userId) {
    await User.findByIdAndUpdate(userId, { isActive: true });
    await AdminLog.create({
      adminId: req.user._id,
      action: "USER_ACTIVATED",
      targetUserId: userId,
    });
    return res
      .status(200)
      .json(formatResponse(null, "User activated successfully"));
  }

  if (action === "updateRole" && userId && role) {
    await User.findByIdAndUpdate(userId, { role });
    await AdminLog.create({
      adminId: req.user._id,
      action: "ROLE_UPDATED",
      targetUserId: userId,
      details: JSON.stringify({ newRole: role }),
    });
    return res
      .status(200)
      .json(formatResponse(null, "User role updated successfully"));
  }

  return res.status(400).json(formatResponse(null, "Invalid action"));
});

export const manageSettings = asyncHandler(async (req: any, res: any) => {
  const { setting, value } = req.body;

  const redisKey = `admin:setting:${setting}`;

  if (req.method === "GET") {
    const settingValue = await require("../config/db").redis.get(redisKey);
    return res
      .status(200)
      .json(formatResponse({ [setting]: settingValue }, "Setting retrieved"));
  }

  await require("../config/db").redis.set(redisKey, JSON.stringify(value));

  await AdminLog.create({
    adminId: req.user._id,
    action: "SETTING_UPDATED",
    details: JSON.stringify({ setting, value }),
  });

  return res
    .status(200)
    .json(formatResponse(null, "Setting updated successfully"));
});

export const viewReports = asyncHandler(async (req: any, res: any) => {
  const { type, startDate, endDate } = req.query;

  let query: any = {};

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (type === "resumes") {
    const reports = await Resume.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(formatResponse(reports, "Resume reports retrieved"));
  }

  if (type === "subscriptions") {
    const reports = await Subscription.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(formatResponse(reports, "Subscription reports retrieved"));
  }

  const logs = await AdminLog.find(query)
    .populate("adminId", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json(formatResponse(logs, "Admin logs retrieved"));
});

export const manageContent = asyncHandler(async (req: any, res: any) => {
  const { action, contentId, title, body, type } = req.body;

  if (action === "create") {
    const content = { title, body, type, createdAt: new Date() };
    const redisKey = `content:${Date.now()}`;
    await require("../config/db").redis.set(redisKey, JSON.stringify(content));

    return res
      .status(201)
      .json(formatResponse({ id: redisKey }, "Content created successfully"));
  }

  if (action === "update" && contentId) {
    const content = { title, body, type, updatedAt: new Date() };
    await require("../config/db").redis.set(contentId, JSON.stringify(content));

    return res
      .status(200)
      .json(formatResponse(null, "Content updated successfully"));
  }

  if (action === "delete" && contentId) {
    await require("../config/db").redis.del(contentId);

    return res
      .status(200)
      .json(formatResponse(null, "Content deleted successfully"));
  }

  return res.status(400).json(formatResponse(null, "Invalid action"));
});

export const viewAnalytics = asyncHandler(async (req: any, res: any) => {
  const { period = "month" } = req.query;

  let dateFilter = {};
  const now = new Date();

  if (period === "week") {
    dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
  } else if (period === "month") {
    dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
  } else if (period === "year") {
    dateFilter = { $gte: new Date(now.getFullYear(), 0, 1) };
  }

  const userGrowth = await User.aggregate([
    { $match: { createdAt: dateFilter } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const resumeCreated = await Resume.aggregate([
    { $match: { createdAt: dateFilter } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topUsers = await Resume.aggregate([
    { $group: { _id: "$user", count: { $sum: 1 } } },
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

  return res
    .status(200)
    .json(
      formatResponse(
        { userGrowth, resumeCreated, topUsers },
        "Analytics retrieved successfully",
      ),
    );
});

export const manageRoles = asyncHandler(async (req: any, res: any) => {
  const { action, roleName, permissions } = req.body;

  const rolesKey = "admin:roles";
  let roles = JSON.parse(
    (await require("../config/db").redis.get(rolesKey)) || "[]",
  );

  if (action === "create") {
    roles.push({ name: roleName, permissions, createdAt: new Date() });
  } else if (action === "update") {
    const index = roles.findIndex((r: any) => r.name === roleName);
    if (index !== -1)
      roles[index] = { name: roleName, permissions, updatedAt: new Date() };
  } else if (action === "delete") {
    roles = roles.filter((r: any) => r.name !== roleName);
  }

  await require("../config/db").redis.set(rolesKey, JSON.stringify(roles));

  await AdminLog.create({
    adminId: req.user._id,
    action: `ROLE_${action.toUpperCase()}`,
    details: JSON.stringify({ roleName, permissions }),
  });

  return res
    .status(200)
    .json(formatResponse(roles, `Role ${action}d successfully`));
});

export const managePermissions = asyncHandler(async (req: any, res: any) => {
  const { action, permissionName, resource, actions: permActions } = req.body;

  const permissionsKey = "admin:permissions";
  let permissions = JSON.parse(
    (await require("../config/db").redis.get(permissionsKey)) || "[]",
  );

  if (action === "create") {
    permissions.push({
      name: permissionName,
      resource,
      actions: permActions,
      createdAt: new Date(),
    });
  } else if (action === "update") {
    const index = permissions.findIndex((p: any) => p.name === permissionName);
    if (index !== -1)
      permissions[index] = {
        name: permissionName,
        resource,
        actions: permActions,
      };
  } else if (action === "delete") {
    permissions = permissions.filter((p: any) => p.name !== permissionName);
  }

  await require("../config/db").redis.set(
    permissionsKey,
    JSON.stringify(permissions),
  );

  return res
    .status(200)
    .json(formatResponse(permissions, `Permission ${action}d successfully`));
});

export const manageNotifications = asyncHandler(async (req: any, res: any) => {
  const { action, userId, title, message, type } = req.body;

  if (action === "send") {
    const notification = {
      user: userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date(),
    };

    const notificationsKey = `notifications:${userId}`;
    const notifications = JSON.parse(
      (await require("../config/db").redis.get(notificationsKey)) || "[]",
    );
    notifications.push(notification);
    await require("../config/db").redis.set(
      notificationsKey,
      JSON.stringify(notifications),
    );

    return res
      .status(201)
      .json(formatResponse(null, "Notification sent successfully"));
  }

  if (action === "broadcast") {
    const users = await User.find({ isActive: true });
    for (const user of users) {
      const notificationsKey = `notifications:${user._id}`;
      const notifications = JSON.parse(
        (await require("../config/db").redis.get(notificationsKey)) || "[]",
      );
      notifications.push({
        title,
        message,
        type,
        read: false,
        createdAt: new Date(),
      });
      await require("../config/db").redis.set(
        notificationsKey,
        JSON.stringify(notifications),
      );
    }
    return res
      .status(200)
      .json(formatResponse(null, "Broadcast notification sent to all users"));
  }

  return res.status(400).json(formatResponse(null, "Invalid action"));
});

export const manageIntegrations = asyncHandler(async (req: any, res: any) => {
  const { action, integrationName, apiKey, apiSecret, config } = req.body;

  const integrationsKey = "admin:integrations";
  let integrations = JSON.parse(
    (await require("../config/db").redis.get(integrationsKey)) || "[]",
  );

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
    const index = integrations.findIndex(
      (i: any) => i.name === integrationName,
    );
    if (index !== -1) {
      integrations[index] = {
        ...integrations[index],
        apiKey: apiKey || integrations[index].apiKey,
        apiSecret: apiSecret || integrations[index].apiSecret,
        config: config || integrations[index].config,
      };
    }
  } else if (action === "toggle") {
    const integration = integrations.find(
      (i: any) => i.name === integrationName,
    );
    if (integration) integration.enabled = !integration.enabled;
  }

  await require("../config/db").redis.set(
    integrationsKey,
    JSON.stringify(integrations),
  );

  return res
    .status(200)
    .json(formatResponse(integrations, `Integration ${action}ed successfully`));
});

export const manageThemes = asyncHandler(async (req: any, res: any) => {
  const { action, themeName, colors, fonts, layout } = req.body;

  const themesKey = "admin:themes";
  let themes = JSON.parse(
    (await require("../config/db").redis.get(themesKey)) || "[]",
  );

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
  }

  await require("../config/db").redis.set(themesKey, JSON.stringify(themes));

  return res
    .status(200)
    .json(formatResponse(themes, `Theme ${action}d successfully`));
});

export const manageLanguages = asyncHandler(async (req: any, res: any) => {
  const { action, languageCode, languageName, translations } = req.body;

  const languagesKey = "admin:languages";
  let languages = JSON.parse(
    (await require("../config/db").redis.get(languagesKey)) || "[]",
  );

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
  }

  await require("../config/db").redis.set(
    languagesKey,
    JSON.stringify(languages),
  );

  return res
    .status(200)
    .json(formatResponse(languages, `Language ${action}ed successfully`));
});

export const manageCurrencies = asyncHandler(async (req: any, res: any) => {
  const { action, currencyCode, currencyName, symbol, exchangeRate } = req.body;

  const currenciesKey = "admin:currencies";
  let currencies = JSON.parse(
    (await require("../config/db").redis.get(currenciesKey)) || "[]",
  );

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
  }

  await require("../config/db").redis.set(
    currenciesKey,
    JSON.stringify(currencies),
  );

  return res
    .status(200)
    .json(formatResponse(currencies, `Currency ${action}ed successfully`));
});

export const managePaymentMethods = asyncHandler(async (req: any, res: any) => {
  const { action, methodName, config, enabled } = req.body;

  const paymentMethodsKey = "admin:paymentMethods";
  let paymentMethods = JSON.parse(
    (await require("../config/db").redis.get(paymentMethodsKey)) || "[]",
  );

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
  }

  await require("../config/db").redis.set(
    paymentMethodsKey,
    JSON.stringify(paymentMethods),
  );

  return res
    .status(200)
    .json(
      formatResponse(paymentMethods, `Payment method ${action}ed successfully`),
    );
});
