import React from "react";
import { AdminLog } from "../../types/admin.types";
import { Clock, ShieldAlert, CheckCircle, Activity, User, FileText } from "lucide-react";

interface SystemLogsTableProps {
  logs: AdminLog[];
  loading?: boolean;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
}

export const SystemLogsTable: React.FC<SystemLogsTableProps> = ({
  logs,
  loading,
  typeFilter,
  onTypeFilterChange,
}) => {
  const getActionBadge = (action: string) => {
    if (action.includes("ACTIVATED") || action.includes("SUCCESS")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="w-3 h-3" /> {action}
        </span>
      );
    }
    if (action.includes("DEACTIVATED") || action.includes("DELETE")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <ShieldAlert className="w-3 h-3" /> {action}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <Activity className="w-3 h-3" /> {action}
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" /> Audit Activity Logs
          </h4>
          <p className="text-xs text-gray-400">System audit trails of administrative actions</p>
        </div>

        <div className="flex items-center gap-2">
          {["logs", "resumes", "subscriptions"].map((type) => (
            <button
              key={type}
              onClick={() => onTypeFilterChange(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                typeFilter === type
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800/80">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-900/90 text-xs font-semibold uppercase text-gray-400 tracking-wider border-b border-gray-800">
            <tr>
              <th className="px-5 py-3.5">Admin Operator</th>
              <th className="px-5 py-3.5">Action Event</th>
              <th className="px-5 py-3.5">Details</th>
              <th className="px-5 py-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-6 w-32 bg-gray-800 rounded-lg" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-24 bg-gray-800 rounded-lg" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-48 bg-gray-800 rounded-lg" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-28 bg-gray-800 rounded-lg" /></td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                  No activity logs recorded.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const adminName =
                  typeof log.adminId === "object" ? log.adminId?.name || "Admin" : "System Operator";
                return (
                  <tr key={log._id} className="hover:bg-gray-900/40 transition-all">
                    <td className="px-5 py-4 font-medium text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold">
                        {adminName.slice(0, 1)}
                      </div>
                      {adminName}
                    </td>
                    <td className="px-5 py-4">{getActionBadge(log.action)}</td>
                    <td className="px-5 py-4 text-xs font-mono text-gray-400 truncate max-w-xs">
                      {log.details || "N/A"}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemLogsTable;
