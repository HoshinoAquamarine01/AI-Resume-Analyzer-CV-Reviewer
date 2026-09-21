import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAdminDashboard from "../hooks/useAdminDashboard";
import useAdminUsers from "../hooks/useAdminUsers";
import useAdminLogs from "../hooks/useAdminLogs";

import AdminHeader from "../components/admin/AdminHeader";
import AdminStatGrid from "../components/admin/AdminStatGrid";
import AdminAnalyticsCharts from "../components/admin/AdminAnalyticsCharts";
import UserManagementTable from "../components/admin/UserManagementTable";
import UserRoleModal from "../components/admin/UserRoleModal";
import UserStatusModal from "../components/admin/UserStatusModal";
import SystemLogsTable from "../components/admin/SystemLogsTable";
import AdminNotificationModal from "../components/admin/AdminNotificationModal";

import { LayoutDashboard, Users, Clock, Settings, Megaphone, TrendingUp } from "lucide-react";

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "logs" | "settings">("overview");
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const dashboardHook = useAdminDashboard("month");
  const usersHook = useAdminUsers(1, 10);
  const logsHook = useAdminLogs("logs");

  const isUsingMock = dashboardHook.isUsingMock || usersHook.isUsingMock || logsHook.isUsingMock;

  const handleRefreshAll = () => {
    dashboardHook.refetch();
    usersHook.refetch();
    logsHook.refetch();
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
 
      <AdminHeader
        onRefresh={handleRefreshAll}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        isUsingMock={isUsingMock}
        loading={dashboardHook.loading || usersHook.loading}
      />

      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { id: "overview", label: "Overview & Analytics", icon: LayoutDashboard },
            { id: "users", label: "User Management", icon: Users },
            { id: "logs", label: "Audit Logs", icon: Clock },
            { id: "settings", label: "System Broadcast", icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-900/60 text-gray-400 border border-gray-800 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <Link
          to="/admin/financial-analytics"
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <TrendingUp className="w-4 h-4" /> Financial & Revenue Analytics
        </Link>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          
          <AdminStatGrid stats={dashboardHook.stats} loading={dashboardHook.loading} />

          <AdminAnalyticsCharts analytics={dashboardHook.analytics} loading={dashboardHook.loading} />

          <div className="pt-2">
            <h3 className="text-base font-bold text-white mb-3">Recent User Registrations</h3>
            <UserManagementTable
              users={usersHook.users.slice(0, 5)}
              loading={usersHook.loading}
              searchTerm={usersHook.searchTerm}
              roleFilter={usersHook.roleFilter}
              statusFilter={usersHook.statusFilter}
              page={usersHook.page}
              pages={usersHook.pages}
              total={usersHook.total}
              onSearchChange={usersHook.setSearchTerm}
              onRoleFilterChange={usersHook.setRoleFilter}
              onStatusFilterChange={usersHook.setStatusFilter}
              onPageChange={usersHook.setPage}
              onOpenRoleModal={(u) => {
                usersHook.setSelectedUser(u);
                usersHook.setIsRoleModalOpen(true);
              }}
              onOpenStatusModal={(u) => {
                usersHook.setSelectedUser(u);
                usersHook.setIsStatusModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-6 animate-fadeIn">
          <UserManagementTable
            users={usersHook.users}
            loading={usersHook.loading}
            searchTerm={usersHook.searchTerm}
            roleFilter={usersHook.roleFilter}
            statusFilter={usersHook.statusFilter}
            page={usersHook.page}
            pages={usersHook.pages}
            total={usersHook.total}
            onSearchChange={usersHook.setSearchTerm}
            onRoleFilterChange={usersHook.setRoleFilter}
            onStatusFilterChange={usersHook.setStatusFilter}
            onPageChange={usersHook.setPage}
            onOpenRoleModal={(u) => {
              usersHook.setSelectedUser(u);
              usersHook.setIsRoleModalOpen(true);
            }}
            onOpenStatusModal={(u) => {
              usersHook.setSelectedUser(u);
              usersHook.setIsStatusModalOpen(true);
            }}
          />
        </div>
      )}

      {activeTab === "logs" && (
        <div className="space-y-6 animate-fadeIn">
          <SystemLogsTable
            logs={logsHook.logs}
            loading={logsHook.loading}
            typeFilter={logsHook.typeFilter}
            onTypeFilterChange={logsHook.setTypeFilter}
          />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-8 shadow-xl max-w-2xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-purple-400" /> System Broadcast & Announcements
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Send global push announcements or schedule system maintenance notifications for all users.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs space-y-2">
            <p className="font-semibold">💡 Pro Tip for CV / Demo:</p>
            <p>
              Notifications trigger real-time Redis queue operations in backend NestJS gateway module.
            </p>
          </div>

          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 text-sm"
          >
            <Megaphone className="w-4 h-4" /> Open Broadcast Notification Dialog
          </button>
        </div>
      )}

      <UserRoleModal
        isOpen={usersHook.isRoleModalOpen}
        user={usersHook.selectedUser}
        onClose={() => {
          usersHook.setIsRoleModalOpen(false);
          usersHook.setSelectedUser(null);
        }}
        onConfirm={usersHook.updateUserRole}
        loading={usersHook.actionLoading}
      />

      <UserStatusModal
        isOpen={usersHook.isStatusModalOpen}
        user={usersHook.selectedUser}
        onClose={() => {
          usersHook.setIsStatusModalOpen(false);
          usersHook.setSelectedUser(null);
        }}
        onConfirm={usersHook.toggleUserStatus}
        loading={usersHook.actionLoading}
      />

      <AdminNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
}

export default AdminDashboardPage;
