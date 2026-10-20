import React from "react";
import { History, RefreshCw, ShieldCheck } from "lucide-react";

interface ActivityLogHeaderProps {
  loading: boolean;
  totalLogs: number;
  onRefresh: () => void;
}

export const ActivityLogHeader: React.FC<ActivityLogHeaderProps> = ({
  loading,
  totalLogs,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-[#0d1527] to-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
     
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/10">
          <History className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Activity History
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Live Tracking
            </span>
          </div>

          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Audit log of all security events, resume scans, cover letter generations, and account modifications.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-400 font-medium">Recorded Events</div>
          <div className="text-lg font-bold text-white">{totalLogs} entries</div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700/70 font-medium text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default ActivityLogHeader;
