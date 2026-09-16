import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ActivityLogPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  loading: boolean;
}

export const ActivityLogPagination: React.FC<ActivityLogPaginationProps> = ({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  loading,
}) => {
  if (total <= 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
      
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">{startItem}</span> -{" "}
          <span className="font-semibold text-white">{endItem}</span> of{" "}
          <span className="font-semibold text-white">{total}</span> events
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

     
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-slate-200 border border-slate-700/70 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs font-mono text-slate-400 px-2">
          Page <span className="text-white font-bold">{page}</span> of {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-slate-200 border border-slate-700/70 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ActivityLogPagination;
