import React, { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import ActivityLogHeader from "../components/activity-log/ActivityLogHeader";
import ActivityLogStats from "../components/activity-log/ActivityLogStats";
import ActivityLogFilterBar from "../components/activity-log/ActivityLogFilterBar";
import ActivityLogTimeline from "../components/activity-log/ActivityLogTimeline";
import ActivityLogPagination from "../components/activity-log/ActivityLogPagination";
import {
  ActivityLogItem,
  ActivityActionCategory,
  ActivityStats,
} from "../types/activityLog";
import userService from "../services/userService";

export const ActivityLogPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<ActivityActionCategory>("all");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const fetchActivityLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getActivityLog(page, limit);
      const payload = response?.data || response;
      const activityList: ActivityLogItem[] = payload?.activity || payload?.data?.activity || [];
      const total: number = payload?.total ?? payload?.data?.total ?? activityList.length;
      const pages: number = payload?.pages ?? payload?.data?.pages ?? 1;

      setLogs(activityList);
      setTotalLogs(total);
      setTotalPages(pages);
    } catch (err: any) {
      console.error("Failed to fetch activity logs:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to connect to activity log server";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const act = (item.action || "").toLowerCase();

      if (category !== "all") {
        if (category === "auth" && !act.includes("auth") && !act.includes("login") && !act.includes("register") && !act.includes("password")) {
          return false;
        }
        if (category === "resume" && !act.includes("resume") && !act.includes("ats") && !act.includes("upload") && !act.includes("parse")) {
          return false;
        }
        if (category === "coverletter" && !act.includes("cover") && !act.includes("letter")) {
          return false;
        }
        if (category === "interview" && !act.includes("interview") && !act.includes("question")) {
          return false;
        }
        if (category === "user" && !act.includes("user") && !act.includes("profile") && !act.includes("settings")) {
          return false;
        }
        if (category === "payment" && !act.includes("payment") && !act.includes("subscription")) {
          return false;
        }
      }

      if (search.trim() !== "") {
        const query = search.toLowerCase().trim();
        const actionMatch = act.includes(query);
        const ipMatch = (item.ipAddress || "").toLowerCase().includes(query);
        const detailsMatch = JSON.stringify(item.details || {}).toLowerCase().includes(query);
        if (!actionMatch && !ipMatch && !detailsMatch) return false;
      }

      return true;
    });
  }, [logs, category, search]);

  const stats: ActivityStats = useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        totalCount: totalLogs,
        latestTime: null,
        primaryCategory: "None",
        lastIp: "unknown",
      };
    }

    const latestItem = logs[0];
    let latestTimeStr = "Just now";
    if (latestItem?.createdAt) {
      try {
        const d = new Date(latestItem.createdAt);
        latestTimeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } catch {
        latestTimeStr = "Recent";
      }
    }

    const categoryCounts: Record<string, number> = {};
    logs.forEach((log) => {
      const cat = (log.action || "other").split(".")[0] || "other";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    let topCategory = "General";
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([catName, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = catName.toUpperCase();
      }
    });

    return {
      totalCount: totalLogs,
      latestTime: latestTimeStr,
      primaryCategory: topCategory,
      lastIp: latestItem?.ipAddress || "Localhost",
    };
  }, [logs, totalLogs]);

  const handleResetFilters = () => {
    setCategory("all");
    setSearch("");
  };

  const handleRefresh = () => {
    toast.success("Refreshing activity history...");
    fetchActivityLogs();
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        
        <ActivityLogHeader
          loading={loading}
          totalLogs={totalLogs}
          onRefresh={handleRefresh}
        />

        <ActivityLogStats stats={stats} loading={loading} />

        <ActivityLogFilterBar
          category={category}
          search={search}
          onCategoryChange={(cat) => {
            setCategory(cat);
            setPage(1);
          }}
          onSearchChange={(query) => {
            setSearch(query);
            setPage(1);
          }}
          onReset={handleResetFilters}
        />

        <ActivityLogTimeline
          items={filteredLogs}
          loading={loading}
          error={error}
          onResetFilters={handleResetFilters}
        />

        {!loading && !error && (
          <ActivityLogPagination
            page={page}
            limit={limit}
            total={totalLogs}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            loading={loading}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ActivityLogPage;
