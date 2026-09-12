import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import {
  FinancialAnalyticsSummary,
  FinancialTimeSeriesItem,
  FinancialPlanBreakdown,
  FinancialTransactionItem,
} from "../../types/admin.types";

import FinancialAnalyticsHeader from "../../components/admin/analytics/FinancialAnalyticsHeader";
import RevenueSummaryCards from "../../components/admin/analytics/RevenueSummaryCards";
import RevenueTimeSeriesChart from "../../components/admin/analytics/RevenueTimeSeriesChart";
import SubscriptionPlanBreakdown from "../../components/admin/analytics/SubscriptionPlanBreakdown";
import TransactionsTable from "../../components/admin/analytics/TransactionsTable";

export const AdminFinancialAnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year" | "all">("month");
  const [loading, setLoading] = useState<boolean>(true);

  const [summary, setSummary] = useState<FinancialAnalyticsSummary>({
    totalRevenue: 0,
    periodRevenue: 0,
    activePaidSubscriptions: 0,
    totalSubscriptionsCount: 0,
    paidTransactionsCount: 0,
    pendingCount: 0,
    failedCount: 0,
    averageOrderValue: 0,
  });

  const [timeSeries, setTimeSeries] = useState<FinancialTimeSeriesItem[]>([]);
  const [planBreakdown, setPlanBreakdown] = useState<FinancialPlanBreakdown[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<FinancialTransactionItem[]>([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminService.getFinancialAnalytics(period);
      const data = res.data || res;

      if (data.summary) setSummary(data.summary);
      if (data.timeSeries) setTimeSeries(data.timeSeries);
      if (data.planBreakdown) setPlanBreakdown(data.planBreakdown);
      if (data.recentTransactions) setRecentTransactions(data.recentTransactions);
    } catch (err: any) {
      console.error("Failed to load financial analytics:", err);
      toast.error(err?.response?.data?.message || "Failed to connect to backend financial analytics API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
     
      <FinancialAnalyticsHeader
        period={period}
        loading={loading}
        onPeriodChange={setPeriod}
        onRefresh={fetchAnalytics}
      />

     
      <RevenueSummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueTimeSeriesChart timeSeries={timeSeries} />
        </div>
        <div>
          <SubscriptionPlanBreakdown planBreakdown={planBreakdown} />
        </div>
      </div>

      
      <TransactionsTable transactions={recentTransactions} />
    </div>
  );
};

export default AdminFinancialAnalyticsPage;
