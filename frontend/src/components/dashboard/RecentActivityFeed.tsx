import React, { useEffect, useState } from "react";
import { Activity, CheckCircle2, FileEdit, Target, MessageSquare, FileText, Loader2 } from "lucide-react";
import userService from "../../services/userService";

export interface ActivityLogItem {
  id: string;
  type: "scan" | "ats" | "cover_letter" | "interview" | "login" | "general";
  title: string;
  timestamp: string;
  badgeText: string;
}

export const RecentActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchActivityLogs = async () => {
      try {
        const response = await userService.getActivityLog(1, 5);
        const data = response?.data || response;
        const list = Array.isArray(data) ? data : data?.logs || [];

        if (isMounted) {
          const formatted: ActivityLogItem[] = list.map((item: any) => {
            const action = (item.action || "ACTIVITY").toUpperCase();
            let type: ActivityLogItem["type"] = "general";
            let badgeText = "Completed";

            if (action.includes("RESUME") || action.includes("UPLOAD")) {
              type = "scan";
              badgeText = "CV Uploaded";
            } else if (action.includes("ATS") || action.includes("ANALYZE")) {
              type = "ats";
              badgeText = "ATS Audited";
            } else if (action.includes("COVER")) {
              type = "cover_letter";
              badgeText = "Letter Created";
            } else if (action.includes("INTERVIEW")) {
              type = "interview";
              badgeText = "Mock Practice";
            } else if (action.includes("LOGIN")) {
              type = "login";
              badgeText = "Auth Activity";
            }

            return {
              id: item._id || item.id || Math.random().toString(),
              type,
              title: item.details
                ? typeof item.details === "string"
                  ? item.details
                  : JSON.stringify(item.details)
                : `Performed ${item.action || "action"}`,
              timestamp: item.createdAt
                ? new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                : "Just now",
              badgeText,
            };
          });

          setActivities(formatted);
        }
      } catch (err) {
        console.error("Failed to load real activity logs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActivityLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const getActivityIcon = (type: ActivityLogItem["type"]) => {
    switch (type) {
      case "ats":
        return <Target className="w-4 h-4 text-emerald-400" />;
      case "cover_letter":
        return <FileEdit className="w-4 h-4 text-purple-400" />;
      case "interview":
        return <MessageSquare className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  const getActivityBadgeStyle = (type: ActivityLogItem["type"]) => {
    switch (type) {
      case "ats":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "cover_letter":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "interview":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0d1322]/80 border border-slate-800/80 backdrop-blur-md shadow-xl min-h-[320px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              AI Activity Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Recent actions processed by AI engines</p>
          </div>

          <span className="text-[10px] font-semibold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Live Sync
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span className="text-xs">Fetching activity timeline...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
            <Activity className="w-8 h-8 text-slate-400 mb-1 opacity-60" />
            <h4 className="text-xs font-semibold text-slate-300">No activity logged yet</h4>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Actions like CV scans, ATS matching, and AI interviews will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {activities.map((item) => (
              <div key={item.id} className="relative flex items-start justify-between gap-4 group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#0d1322] border border-slate-700 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                  {getActivityIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors leading-snug truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{item.timestamp}</span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${getActivityBadgeStyle(
                    item.type
                  )}`}
                >
                  {item.badgeText}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;

