import React from "react";
import { User, Mail, Shield, ToggleLeft, ToggleRight, Calendar } from "lucide-react";
import { UserRole } from "../../../types/admin.types";

interface UserProfileFormProps {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  onChangeName: (val: string) => void;
  onChangeEmail: (val: string) => void;
  onChangeRole: (val: UserRole) => void;
  onToggleStatus: () => void;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  name,
  email,
  role,
  isActive,
  createdAt,
  onChangeName,
  onChangeEmail,
  onChangeRole,
  onToggleStatus,
}) => {
  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" /> General Profile Settings
        </h3>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> Registered:{" "}
          {createdAt ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
     
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900/90 border border-gray-800 focus:border-blue-500 focus:outline-none text-white text-sm transition-all"
            placeholder="John Doe"
          />
        </div>

      
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900/90 border border-gray-800 focus:border-blue-500 focus:outline-none text-white text-sm transition-all"
            placeholder="user@example.com"
          />
        </div>

       
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" /> Account System Role
          </label>
          <select
            value={role}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900/90 border border-gray-800 focus:border-purple-500 focus:outline-none text-white text-sm transition-all"
          >
            <option value="user">User (Standard Access)</option>
            <option value="moderator">Moderator (Content Review)</option>
            <option value="admin">Administrator (Full Control)</option>
          </select>
        </div>

     
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300">Account Access Status</label>
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/90 border border-gray-800">
            <div className="text-xs">
              <p className="font-bold text-white">{isActive ? "Account Active" : "Account Suspended"}</p>
              <p className="text-gray-400 text-[11px]">
                {isActive ? "User can sign in and use AI features" : "Access blocked; API requests forbidden"}
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleStatus}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isActive ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-red-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
