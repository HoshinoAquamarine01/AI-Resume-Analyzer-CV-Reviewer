import React from "react";
import { ActivityLogItem } from "../../types/activityLog";
import ActivityLogItemCard from "./ActivityLogItemCard";
import { Inbox, AlertCircle } from "lucide-react";

interface ActivityLogTimelineProps {
  items: ActivityLogItem[];
  loading: boolean;
  error: string | null;
  onResetFilters?: () => void;
}

export const ActivityLogTimeline: React.FC<ActivityLogTimelineProps> = ({
  items,
  loading,
  error,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 animate-pulse flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-800 rounded w-1/4" />
              </div>
              <div className="h-3 bg-slate-800/60 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-rose-300">Failed to Load Activity Logs</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center mx-auto">
          <Inbox className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">No Activity Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            There are no recorded logs matching your current category filter or search query.
          </p>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-colors"
          >
            Clear Search & Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      
      {items.map((item) => (
        <ActivityLogItemCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default ActivityLogTimeline;
