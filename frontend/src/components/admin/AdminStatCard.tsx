import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  accentColor?: "blue" | "emerald" | "purple" | "amber" | "indigo" | "rose";
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  isPositive = true,
  subtitle,
  accentColor = "blue",
}) => {
  const colorMap = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400 bg-blue-500/10",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400 bg-purple-500/10",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400 bg-amber-500/10",
    indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    rose: "from-rose-500/20 to-rose-600/5 border-rose-500/30 text-rose-400 bg-rose-500/10",
  };

  const badgeColor = isPositive
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    : "bg-rose-500/10 text-rose-400 border border-rose-500/20";

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300 shadow-xl shadow-black/20">
    
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[accentColor].split(" ")[0]} opacity-80`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[accentColor].split(" ").slice(-2).join(" ")} shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-800/60 text-xs">
        {change && (
          <span className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
        {subtitle && <span className="text-gray-500 font-medium">{subtitle}</span>}
      </div>
    </div>
  );
};

export default AdminStatCard;
