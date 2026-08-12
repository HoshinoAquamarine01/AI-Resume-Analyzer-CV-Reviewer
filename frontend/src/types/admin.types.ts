// Shared TypeScript types for Admin domain

export type UserRole = "user" | "admin" | "moderator";

export type AdminUserAction = "list" | "activate" | "deactivate" | "updateRole";

export interface AdminUserItem {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified?: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUsersManageResponse {
  users: AdminUserItem[];
  total: number;
  pages: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalResumes: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
}

export interface AdminLog {
  _id: string;
  adminId: {
    _id: string;
    name?: string;
    email?: string;
  } | string;
  action: string;
  targetUserId?: string;
  details?: string;
  createdAt: string;
}

export type AnalyticsPeriod = "week" | "month" | "year";

export interface AnalyticsTimeSeriesItem {
  _id: string; // Date string e.g. "2026-08-12"
  count: number;
}

export interface AnalyticsTopUser {
  _id: string; // userId
  count: number;
  userInfo?: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

export interface AdminAnalyticsResponse {
  userGrowth: AnalyticsTimeSeriesItem[];
  resumeCreated: AnalyticsTimeSeriesItem[];
  topUsers: AnalyticsTopUser[];
}

export interface SystemSetting {
  setting: string;
  value: any;
}

export interface AdminRole {
  name: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPermission {
  name: string;
  resource?: string;
  actions?: string[];
  createdAt?: string;
}

export interface AdminNotificationPayload {
  userId?: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "error" | string;
}

export interface AdminIntegration {
  name: string;
  apiKey?: string;
  apiSecret?: string;
  config?: Record<string, any>;
  enabled: boolean;
  createdAt?: string;
}

export interface AdminTheme {
  name: string;
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  layout?: Record<string, any>;
  active: boolean;
  createdAt?: string;
}

export interface AdminLanguage {
  code: string;
  name: string;
  translations?: Record<string, string>;
  active: boolean;
}

export interface AdminCurrency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  active: boolean;
}

export interface AdminPaymentMethod {
  name: string;
  config?: Record<string, any>;
  enabled: boolean;
  createdAt?: string;
}
