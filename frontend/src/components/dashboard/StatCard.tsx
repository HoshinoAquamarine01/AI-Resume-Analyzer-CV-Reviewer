import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  progressPercentage?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconBgColor = "bg-blue-500/10",
  iconTextColor = "text-blue-400",
  progressPercentage,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0d1322]/80 border border-slate-800/80 hover:border-slate-700/80 backdrop-blur-md transition-all duration-300 shadow-lg group hover:translate-y-[-2px]">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </div>
        </div>

        <div className={`p-3 rounded-2xl ${iconBgColor} ${iconTextColor} shadow-inner group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {progressPercentage !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1.5">
            <span>ATS Performance Score</span>
            <span className="text-blue-400 font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
        </div>
      )}

      {(trend || subtitle) && progressPercentage === undefined && (
        <div className="mt-3 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={`flex items-center gap-1 font-semibold ${
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-slate-400 text-[11px]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
