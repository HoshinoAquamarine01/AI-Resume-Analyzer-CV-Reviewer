import React from "react";
import { Crown, Zap, Clock, CreditCard, Sparkles } from "lucide-react";
import { AdminSubscriptionItem } from "../../../types/admin.types";

interface UserSubscriptionCardProps {
  subscription: AdminSubscriptionItem | null;
  selectedPlan: "free" | "pro" | "premium";
  daysToAdd: number;
  onPlanChange: (plan: "free" | "pro" | "premium") => void;
  onDaysChange: (days: number) => void;
}

export const UserSubscriptionCard: React.FC<UserSubscriptionCardProps> = ({
  subscription,
  selectedPlan,
  daysToAdd,
  onPlanChange,
  onDaysChange,
}) => {
  const currentPlan = subscription?.plan || "free";
  const currentStatus = subscription?.status || "active";
  const formattedPrice = subscription?.price
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subscription.price)
    : "Free Tier";

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" /> Subscription & Plan Override
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            currentPlan === "premium"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
              : currentPlan === "pro"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
              : "bg-gray-800 text-gray-400 border border-gray-700"
          }`}
        >
          Current: {currentPlan}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Plan Price
          </div>
          <p className="text-lg font-extrabold text-white mt-1">{formattedPrice}</p>
        </div>

        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Zap className="w-4 h-4 text-blue-400" /> Status
          </div>
          <p className="text-lg font-extrabold capitalize text-emerald-400 mt-1">{currentStatus}</p>
        </div>

        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Clock className="w-4 h-4 text-amber-400" /> Expires On
          </div>
          <p className="text-sm font-bold text-white mt-1">
            {subscription?.endDate
              ? new Date(subscription.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "No Expiration"}
          </p>
        </div>
      </div>

    
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Admin Plan Assignment & Extension
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Assign Subscription Plan</label>
            <select
              value={selectedPlan}
              onChange={(e) => onPlanChange(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="free">Free Plan (5 Analyses)</option>
              <option value="pro">Pro Plan (199,000 VND / mo)</option>
              <option value="premium">Premium VIP Plan (499,000 VND / mo)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Validity Duration (Days)</label>
            <select
              value={daysToAdd}
              onChange={(e) => onDaysChange(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value={30}>+ 30 Days (1 Month)</option>
              <option value={90}>+ 90 Days (3 Months)</option>
              <option value={180}>+ 180 Days (6 Months)</option>
              <option value={365}>+ 365 Days (1 Year VIP)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSubscriptionCard;
