import React, { useState } from "react";
import { AdminUserItem, UserRole } from "../../types/admin.types";
import { ShieldAlert, X, Check, ShieldCheck, User, Sparkles } from "lucide-react";

interface UserRoleModalProps {
  isOpen: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onConfirm: (user: AdminUserItem, newRole: UserRole) => void;
  loading?: boolean;
}

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  loading,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || "user");

  if (!isOpen || !user) return null;

  const roles: { role: UserRole; label: string; desc: string; icon: any; color: string }[] = [
    {
      role: "user",
      label: "Standard User",
      desc: "Can upload CVs, generate ATS reviews, and subscribe to plans.",
      icon: User,
      color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    },
    {
      role: "moderator",
      label: "Moderator",
      desc: "Can review candidate profiles, monitor activity logs, and issue support.",
      icon: Sparkles,
      color: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    },
    {
      role: "admin",
      label: "Super Admin",
      desc: "Full system control: Manage users, alter roles, change settings & view revenue.",
      icon: ShieldCheck,
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-gray-800 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Change User Role</h3>
            <p className="text-xs text-gray-400">Modify system permissions for {user.name}</p>
          </div>
        </div>

        <div className="my-5 p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 font-mono truncate">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.role;
            return (
              <div
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                    : "border-gray-800 bg-gray-900/30 hover:border-gray-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${r.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{r.label}</h5>
                    <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{r.desc}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="p-1 rounded-full bg-blue-500 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(user, selectedRole)}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Save Role Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleModal;
