import React from "react";
import { PieChart, Crown, Zap, ShieldAlert } from "lucide-react";
import { FinancialPlanBreakdown } from "../../../types/admin.types";

interface SubscriptionPlanBreakdownProps {
  planBreakdown: FinancialPlanBreakdown[];
}

export const SubscriptionPlanBreakdown: React.FC<SubscriptionPlanBreakdownProps> = ({ planBreakdown }) => {
  const totalSubscribers = planBreakdown.reduce((acc, curr) => acc + curr.count, 0);

  const getPlanDetails = (planName: string) => {
    switch (planName) {
      case "premium":
        return {
          label: "Premium VIP Tier",
          badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          barBg: "from-purple-600 to-indigo-500",
          icon: Crown,
        };
      case "pro":
        return {
          label: "Pro Tier",
          badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          barBg: "from-blue-600 to-cyan-500",
          icon: Zap,
        };
      default:
        return {
          label: "Free Starter Tier",
          badgeBg: "bg-gray-800 text-gray-400 border-gray-700",
          barBg: "from-gray-700 to-slate-600",
          icon: ShieldAlert,
        };
    }
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" /> Plan Distribution & Tier Revenue
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Breakdown by Free, Pro, and Premium VIP tiers</p>
        </div>
      </div>

      <div className="space-y-5">
        {planBreakdown.map((plan) => {
          const details = getPlanDetails(plan._id);
          const Icon = details.icon;
          const percentage = totalSubscribers > 0 ? Math.round((plan.count / totalSubscribers) * 100) : 0;

          return (
            <div key={plan._id} className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`p-2 rounded-lg border ${details.badgeBg}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{details.label}</h4>
                    <p className="text-xs text-gray-400">
                      {plan.count} Subscribers ({percentage}%)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-extrabold text-emerald-400">{formatVND(plan.revenue)}</p>
                  <p className="text-[11px] text-gray-500 font-medium">Generated Revenue</p>
                </div>
              </div>

            
              <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full bg-gradient-to-r ${details.barBg} transition-all duration-500`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPlanBreakdown;
