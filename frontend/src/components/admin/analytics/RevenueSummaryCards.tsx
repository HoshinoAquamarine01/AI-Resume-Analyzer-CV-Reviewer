import React from "react";
import { DollarSign, Wallet, UserCheck, ShoppingBag, Clock, AlertTriangle } from "lucide-react";
import { FinancialAnalyticsSummary } from "../../../types/admin.types";

interface RevenueSummaryCardsProps {
  summary: FinancialAnalyticsSummary;
}

export const RevenueSummaryCards: React.FC<RevenueSummaryCardsProps> = ({ summary }) => {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const cards = [
    {
      title: "Total Revenue (All Time)",
      value: formatVND(summary.totalRevenue),
      subtitle: `${summary.paidTransactionsCount} Paid Transactions`,
      icon: DollarSign,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Selected Period Revenue",
      value: formatVND(summary.periodRevenue),
      subtitle: "Current Active Window",
      icon: Wallet,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    },
    {
      title: "Active Paid Subscribers",
      value: summary.activePaidSubscriptions,
      subtitle: `Out of ${summary.totalSubscriptionsCount} Total Subscriptions`,
      icon: UserCheck,
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    },
    {
      title: "Average Order Value (AOV)",
      value: formatVND(summary.averageOrderValue),
      subtitle: "Per Subscription Checkout",
      icon: ShoppingBag,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
    {
      title: "Pending Checkout Queue",
      value: summary.pendingCount,
      subtitle: "Awaiting Gateway Confirmation",
      icon: Clock,
      color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
    },
    {
      title: "Failed / Cancelled Orders",
      value: summary.failedCount,
      subtitle: "Expired Payment Checkout Sessions",
      icon: AlertTriangle,
      color: "from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-gradient-to-br ${card.color} backdrop-blur-xl border p-5 rounded-2xl shadow-lg flex items-start justify-between transition-all hover:scale-[1.01]`}
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-300">{card.title}</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{card.value}</h3>
              <p className="text-[11px] text-gray-400 font-medium">{card.subtitle}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RevenueSummaryCards;
