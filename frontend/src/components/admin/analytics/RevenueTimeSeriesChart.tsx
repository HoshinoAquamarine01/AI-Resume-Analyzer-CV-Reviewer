import React from "react";
import { BarChart3, TrendingUp, DollarSign } from "lucide-react";
import { FinancialTimeSeriesItem } from "../../../types/admin.types";

interface RevenueTimeSeriesChartProps {
  timeSeries: FinancialTimeSeriesItem[];
}

export const RevenueTimeSeriesChart: React.FC<RevenueTimeSeriesChartProps> = ({ timeSeries }) => {
  const maxRevenue = Math.max(...timeSeries.map((t) => t.revenue), 1);

  const formatVND = (amount: number) => {
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M VND`;
    }
    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(0)}k VND`;
    }
    return `${amount} VND`;
  };

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" /> Revenue Growth Trend
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Aggregated payments over the selected date range</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Growth Trend
        </span>
      </div>

      {timeSeries.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
          <DollarSign className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-400">No completed paid transactions in this time window.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-48 flex items-end gap-2 pt-6 pb-2 px-2 overflow-x-auto border-b border-gray-800">
            {timeSeries.map((item) => {
              const heightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 8);
              return (
                <div key={item._id} className="flex-1 min-w-[36px] flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 border border-gray-700 text-white text-[10px] py-1 px-2 rounded font-bold shadow-lg pointer-events-none whitespace-nowrap">
                    {formatVND(item.revenue)} ({item.transactions} orders)
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 rounded-t-lg transition-all group-hover:from-emerald-500 group-hover:to-cyan-300 shadow-md shadow-emerald-500/20"
                  ></div>
                  <span className="text-[10px] text-gray-400 font-mono rotate-[-45px] sm:rotate-0 transform origin-top-left">
                    {item._id.slice(-5)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
            <span>Range Start: {timeSeries[0]?._id}</span>
            <span>Range End: {timeSeries[timeSeries.length - 1]?._id}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueTimeSeriesChart;
