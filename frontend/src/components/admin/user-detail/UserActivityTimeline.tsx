import React from "react";
import { Clock, Activity, LogIn, FileUp, Sparkles, CheckCircle2 } from "lucide-react";
import { AdminActivityItem } from "../../../types/admin.types";

interface UserActivityTimelineProps {
  activities: AdminActivityItem[];
}

export const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({ activities }) => {
  const getActivityIcon = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("LOGIN") || act.includes("AUTH")) return LogIn;
    if (act.includes("RESUME") || act.includes("UPLOAD")) return FileUp;
    if (act.includes("AI") || act.includes("MATCH")) return Sparkles;
    return Activity;
  };

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" /> Recent User Activity Feed
        </h3>
        <span className="text-xs text-gray-400">{activities.length} Events</span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-800 rounded-xl">
          <Activity className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-400">No activity logs recorded for this user yet.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-800">
          {activities.map((act) => {
            const Icon = getActivityIcon(act.action);
            return (
              <div key={act._id} className="relative flex items-start gap-4 group">
                <div className="absolute -left-6 p-1 rounded-full bg-gray-900 border border-gray-700 group-hover:border-purple-500 transition-all text-purple-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="bg-gray-900/80 border border-gray-800/80 p-3 rounded-xl flex-1 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="capitalize">{act.action.replace(/_/g, " ")}</span>
                    <span className="text-[11px] text-gray-500 font-normal">
                      {new Date(act.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {act.details && (
                    <p className="text-gray-400 font-mono text-[11px] truncate">
                      {typeof act.details === "string" ? act.details : JSON.stringify(act.details)}
                    </p>
                  )}
                  {act.ipAddress && <p className="text-[10px] text-gray-500">IP: {act.ipAddress}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserActivityTimeline;
