import React from "react";
import { AdminUserItem } from "../../types/admin.types";
import { AlertTriangle, UserCheck, UserX, X } from "lucide-react";

interface UserStatusModalProps {
  isOpen: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onConfirm: (user: AdminUserItem) => void;
  loading?: boolean;
}

export const UserStatusModal: React.FC<UserStatusModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!isOpen || !user) return null;

  const isDeactivating = user.isActive;

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
          <div
            className={`p-3 rounded-xl border ${
              isDeactivating
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}
          >
            {isDeactivating ? <UserX className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isDeactivating ? "Deactivate User Account" : "Reactivate User Account"}
            </h3>
            <p className="text-xs text-gray-400">Confirm account status change for {user.name}</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed my-4">
          {isDeactivating ? (
            <>
              Are you sure you want to deactivate <strong className="text-white">{user.name}</strong> (
              <span className="font-mono text-gray-400">{user.email}</span>)? The user will be logged out and unable to access AI features.
            </>
          ) : (
            <>
              Reactivating <strong className="text-white">{user.name}</strong> will restore access to their saved CVs and subscription privileges.
            </>
          )}
        </p>

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
            onClick={() => onConfirm(user)}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg flex items-center gap-2 ${
              isDeactivating
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
                : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
            }`}
          >
            {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isDeactivating ? "Deactivate Account" : "Activate Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusModal;
