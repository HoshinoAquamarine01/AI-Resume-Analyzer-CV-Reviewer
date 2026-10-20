import React from "react";
import { Link } from "react-router-dom";
import { AdminUserItem, UserRole } from "../../types/admin.types";
import {
  Search,
  Filter,
  ShieldCheck,
  User,
  Shield,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Calendar,
  Mail,
  Eye,
} from "lucide-react";

interface UserManagementTableProps {
  users: AdminUserItem[];
  loading?: boolean;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  page: number;
  pages: number;
  total: number;
  onSearchChange: (val: string) => void;
  onRoleFilterChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
  onPageChange: (newPage: number) => void;
  onOpenRoleModal: (user: AdminUserItem) => void;
  onOpenStatusModal: (user: AdminUserItem) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  loading,
  searchTerm,
  roleFilter,
  statusFilter,
  page,
  pages,
  total,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onPageChange,
  onOpenRoleModal,
  onOpenStatusModal,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
          </span>
        );
      case "moderator":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-3.5 h-3.5" /> Moderator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <User className="w-3.5 h-3.5" /> User
          </span>
        );
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <span className="w-2 h-2 rounded-full bg-rose-400" /> Inactive
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 shadow-xl space-y-5">
     
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900/60 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-gray-900">All Roles</option>
              <option value="user" className="bg-gray-900">User</option>
              <option value="moderator" className="bg-gray-900">Moderator</option>
              <option value="admin" className="bg-gray-900">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-gray-900">All Status</option>
              <option value="active" className="bg-gray-900">Active</option>
              <option value="inactive" className="bg-gray-900">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800/80">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-900/90 text-xs font-semibold uppercase text-gray-400 tracking-wider border-b border-gray-800">
            <tr>
              <th className="px-5 py-3.5">User Profile</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Joined Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-10 w-48 bg-gray-800 rounded-lg" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-20 bg-gray-800 rounded-lg" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-16 bg-gray-800 rounded-lg" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-24 bg-gray-800 rounded-lg" /></td>
                  <td className="px-5 py-4 text-right"><div className="h-8 w-24 bg-gray-800 rounded-lg ml-auto" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                  No matching user accounts found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-900/40 transition-all">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-5 py-4">{getStatusBadge(user.isActive)}</td>
                  <td className="px-5 py-4 text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/users/${user._id || user.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </Link>

                      <button
                        onClick={() => onOpenRoleModal(user)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                      >
                        Edit Role
                      </button>

                      <button
                        onClick={() => onOpenStatusModal(user)}
                        className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                          user.isActive
                            ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20"
                            : "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20"
                        }`}
                        title={user.isActive ? "Deactivate User" : "Activate User"}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
        <p>
          Showing <span className="font-semibold text-white">{users.length}</span> of{" "}
          <span className="font-semibold text-white">{total}</span> users
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 disabled:opacity-40 hover:bg-gray-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="font-mono text-white font-semibold">
            Page {page} / {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 disabled:opacity-40 hover:bg-gray-800 transition-all"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTable;
