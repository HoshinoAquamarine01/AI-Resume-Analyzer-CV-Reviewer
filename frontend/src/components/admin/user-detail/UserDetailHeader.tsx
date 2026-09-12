import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, ShieldCheck, UserX, UserCheck, RefreshCw } from "lucide-react";
import { AdminUserItem } from "../../../types/admin.types";

interface UserDetailHeaderProps {
  user: AdminUserItem | null;
  saving: boolean;
  onSave: () => void;
  onRefresh: () => void;
}

export const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  user,
  saving,
  onSave,
  onRefresh,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-5 rounded-2xl shadow-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin")}
          className="p-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-all border border-gray-700/50"
          title="Back to Admin Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {user ? user.name : "User Details"}
            </h1>
            {user?.role === "admin" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                User
              </span>
            )}

            {user?.isActive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <UserCheck className="w-3.5 h-3.5" /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                <UserX className="w-3.5 h-3.5" /> Suspended
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ID: <span className="font-mono text-gray-300">{user?._id || user?.id || "N/A"}</span> • Email: {user?.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all border border-gray-700"
          title="Refresh User Info"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Changes..." : "Save User Changes"}
        </button>
      </div>
    </div>
  );
};

export default UserDetailHeader;
