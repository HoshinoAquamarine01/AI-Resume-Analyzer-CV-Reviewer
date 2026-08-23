import { useState, useEffect, useCallback } from "react";
import adminService from "../services/adminService";
import { AdminDashboardStats, AdminAnalyticsResponse } from "../types/admin.types";
import { toast } from "react-hot-toast";

const MOCK_STATS: AdminDashboardStats = {
  totalUsers: 1248,
  activeUsers: 980,
  totalResumes: 3420,
  totalSubscriptions: 156,
  activeSubscriptions: 128,
  monthlyRevenue: 4850,
};

const MOCK_ANALYTICS: AdminAnalyticsResponse = {
  userGrowth: [
    { _id: "2026-08-17", count: 12 },
    { _id: "2026-08-18", count: 18 },
    { _id: "2026-08-19", count: 25 },
    { _id: "2026-08-20", count: 31 },
    { _id: "2026-08-21", count: 28 },
    { _id: "2026-08-22", count: 42 },
    { _id: "2026-08-23", count: 55 },
  ],
  resumeCreated: [
    { _id: "2026-08-17", count: 45 },
    { _id: "2026-08-18", count: 62 },
    { _id: "2026-08-19", count: 80 },
    { _id: "2026-08-20", count: 110 },
    { _id: "2026-08-21", count: 95 },
    { _id: "2026-08-22", count: 130 },
    { _id: "2026-08-23", count: 175 },
  ],
  topUsers: [
    { _id: "u1", count: 24, userInfo: [{ _id: "u1", name: "Nguyen Van A", email: "anguyen@gmail.com" }] },
    { _id: "u2", count: 19, userInfo: [{ _id: "u2", name: "Tran Thi B", email: "btran@tech.io" }] },
    { _id: "u3", count: 15, userInfo: [{ _id: "u3", name: "Le Hoang C", email: "cle@startup.vn" }] },
    { _id: "u4", count: 12, userInfo: [{ _id: "u4", name: "Pham Minh D", email: "dpham@dev.net" }] },
  ],
};

export function useAdminDashboard(period: "week" | "month" | "year" = "month") {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMock, setIsUsingMock] = useState<boolean>(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getAnalytics(period),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (analyticsRes?.data) setAnalytics(analyticsRes.data);
      setIsUsingMock(false);
    } catch (err: any) {
      console.warn("Backend API not reachable, using fallback mock data for Admin Dashboard presentation:", err);
      setStats(MOCK_STATS);
      setAnalytics(MOCK_ANALYTICS);
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    analytics,
    loading,
    error,
    isUsingMock,
    refetch: fetchDashboardData,
  };
}

export default useAdminDashboard;
