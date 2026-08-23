import React from "react";
import AdminStatCard from "./AdminStatCard";
import { AdminDashboardStats } from "../../types/admin.types";
import { Users, UserCheck, FileText, CreditCard, DollarSign, Activity } from "lucide-react";

interface AdminStatGridProps {
  stats: AdminDashboardStats | null;
  loading?: boolean;
}

export const AdminStatGrid: React.FC<AdminStatGridProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      <AdminStatCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        icon={Users}
        change="+12.4%"
        isPositive={true}
        subtitle="Registered accounts"
        accentColor="blue"
      />

      <AdminStatCard
        title="Active Users"
        value={stats.activeUsers.toLocaleString()}
        icon={UserCheck}
        change="+8.1%"
        isPositive={true}
        subtitle={`${Math.round((stats.activeUsers / (stats.totalUsers || 1)) * 100)}% active rate`}
        accentColor="emerald"
      />

      <AdminStatCard
        title="Resumes Generated"
        value={stats.totalResumes.toLocaleString()}
        icon={FileText}
        change="+24.5%"
        isPositive={true}
        subtitle="AI Processed CVs"
        accentColor="purple"
      />

      <AdminStatCard
        title="Total Subs"
        value={stats.totalSubscriptions.toLocaleString()}
        icon={CreditCard}
        change="+5.2%"
        isPositive={true}
        subtitle="Pro & Premium plans"
        accentColor="amber"
      />

      <AdminStatCard
        title="Active Subs"
        value={stats.activeSubscriptions.toLocaleString()}
        icon={Activity}
        change="+9.3%"
        isPositive={true}
        subtitle="Currently active"
        accentColor="indigo"
      />

      <AdminStatCard
        title="Monthly Revenue"
        value={formatCurrency(stats.monthlyRevenue)}
        icon={DollarSign}
        change="+18.7%"
        isPositive={true}
        subtitle="Current month estimate"
        accentColor="rose"
      />
    </div>
  );
};

export default AdminStatGrid;
