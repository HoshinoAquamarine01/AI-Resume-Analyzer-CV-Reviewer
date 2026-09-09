import React from "react";
import { Activity, Clock, Shield, Layers } from "lucide-react";
import { ActivityStats } from "../../types/activityLog";

interface ActivityLogStatsProps {
  stats: ActivityStats;
  loading: boolean;
}

export const ActivityLogStats: React.FC<ActivityLogStatsProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: "Total Activities",
      value: loading ? "..." : `${stats.totalCount}`,
      subtitle: "Recorded in audit log",
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Latest Activity",
      value: loading ? "..." : stats.latestTime || "No recent activity",
      subtitle: "Most recent action",
      icon: Clock,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "Main Category",
      value: loading ? "..." : stats.primaryCategory || "N/A",
      subtitle: "Frequent action type",
      icon: Layers,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Recent IP Address",
      value: loading ? "..." : stats.lastIp || "unknown",
      subtitle: "Security network origin",
      icon: Shield,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors"
          >
            <div
              className={`w-11 h-11 rounded-xl ${card.bgColor} border ${card.borderColor} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>

            <div className="overflow-hidden">
              <div className="text-xs text-slate-400 font-medium">{card.title}</div>
              <div className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-400 truncate">{card.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityLogStats;
