import React from "react";
import { ShieldCheck, RefreshCw, Megaphone, Server, Activity, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminHeaderProps {
  onRefresh: () => void;
  onOpenNotificationModal: () => void;
  loading?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onRefresh,
  onOpenNotificationModal,
  loading,
}) => {
  return (
    <div className="rounded-2xl bg-[#111827]/90 backdrop-blur-xl border border-gray-800 p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-all"
          title="Back to User Workspace"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
              Admin Command Control Center
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            System Health: <span className="text-emerald-400 font-semibold">100% Operational</span>
            <span className="text-gray-600">•</span>
            <Activity className="w-3.5 h-3.5 text-blue-400" /> Real-time RBAC Enforcement
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? "animate-spin" : ""}`} />
          Sync Data
        </button>

        <button
          onClick={onOpenNotificationModal}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
        >
          <Megaphone className="w-4 h-4" />
          Broadcast Alert
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
