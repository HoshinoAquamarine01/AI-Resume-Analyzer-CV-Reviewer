import { useState, useEffect, useCallback } from "react";
import adminService from "../services/adminService";
import { AdminDashboardStats, AdminAnalyticsResponse } from "../types/admin.types";
import { toast } from "react-hot-toast";

export function useAdminDashboard(period: "week" | "month" | "year" = "month") {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getAnalytics(period),
      ]);

      setStats(statsRes?.data ?? null);
      setAnalytics(analyticsRes?.data ?? null);
    } catch (err: any) {
      const message = err?.message || "Failed to load admin dashboard data";
      console.error("[useAdminDashboard]", err);
      setError(message);
      setStats(null);
      setAnalytics(null);
      toast.error(message);
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
    refetch: fetchDashboardData,
  };
}

export default useAdminDashboard;
