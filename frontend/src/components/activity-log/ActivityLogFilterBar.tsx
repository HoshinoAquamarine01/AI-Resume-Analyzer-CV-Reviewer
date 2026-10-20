import React from "react";
import { Search, Filter, X } from "lucide-react";
import { ActivityActionCategory } from "../../types/activityLog";

interface CategoryOption {
  id: ActivityActionCategory;
  label: string;
  countBadge?: number;
}

interface ActivityLogFilterBarProps {
  category: ActivityActionCategory;
  search: string;
  onCategoryChange: (cat: ActivityActionCategory) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export const ActivityLogFilterBar: React.FC<ActivityLogFilterBarProps> = ({
  category,
  search,
  onCategoryChange,
  onSearchChange,
  onReset,
}) => {
  const categories: CategoryOption[] = [
    { id: "all", label: "All Events" },
    { id: "auth", label: "Authentication" },
    { id: "resume", label: "Resumes & ATS" },
    { id: "coverletter", label: "Cover Letter" },
    { id: "interview", label: "AI Interview" },
    { id: "user", label: "Account & Profile" },
  ];

  const hasActiveFilters = category !== "all" || search.trim() !== "";

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
       
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>

          {categories.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/30"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      
        <div className="flex items-center gap-2 w-full md:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search action, IP, details..."
              className="w-full bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium transition-colors shrink-0"
              title="Clear all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogFilterBar;
