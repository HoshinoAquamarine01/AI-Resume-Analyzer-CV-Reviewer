import axiosInstance from "./axiosInstance";
import {
  AdminDashboardStats,
  AdminUsersManageResponse,
  AdminAnalyticsResponse,
  AdminLog,
  AdminNotificationPayload,
} from "../types/admin.types";

export interface ManageUsersPayload {
  action: "list" | "activate" | "deactivate" | "updateRole";
  userId?: string;
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const adminService = {

  getDashboard: async (): Promise<{ status: string; data: AdminDashboardStats }> => {
    const response = await axiosInstance.get("/api/admin/dashboard");
    return response.data;
  },


  manageUsers: async (
    payload: ManageUsersPayload
  ): Promise<{ status: string; data: AdminUsersManageResponse | { message: string } }> => {
    const { page = 1, limit = 10, ...body } = payload;
    const response = await axiosInstance.post("/api/admin/users/manage", body, {
      params: { page, limit },
    });
    return response.data;
  },


  getAnalytics: async (period: "week" | "month" | "year" = "month"): Promise<{ status: string; data: AdminAnalyticsResponse }> => {
    const response = await axiosInstance.get("/api/admin/stats", {
      params: { period },
    });
    return response.data;
  },


  getLogs: async (type: string = "logs", startDate?: string, endDate?: string): Promise<{ status: string; data: AdminLog[] }> => {
    const response = await axiosInstance.get("/api/admin/logs", {
      params: { type, startDate, endDate },
    });
    return response.data;
  },


  sendNotification: async (
    payload: AdminNotificationPayload & { action: "send" | "broadcast" }
  ): Promise<{ status: string; message: string }> => {
    const response = await axiosInstance.post("/api/admin/notifications", payload);
    return response.data;
  },


  updateSetting: async (setting: string, value: any): Promise<{ status: string; message: string }> => {
    const response = await axiosInstance.put("/api/admin/settings", { setting, value });
    return response.data;
  },

  getUserDetail: async (id: string) => {
    const response = await axiosInstance.get(`/api/admin/users/${id}`);
    return response.data;
  },

  updateUserDetail: async (id: string, payload: any) => {
    const response = await axiosInstance.put(`/api/admin/users/${id}`, payload);
    return response.data;
  },

  getFinancialAnalytics: async (period: "week" | "month" | "year" | "all" = "month") => {
    const response = await axiosInstance.get("/api/admin/financial-analytics", {
      params: { period },
    });
    return response.data;
  },
};

export default adminService;

