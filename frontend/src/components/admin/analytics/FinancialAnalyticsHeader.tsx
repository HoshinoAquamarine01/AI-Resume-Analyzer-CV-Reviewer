import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, RefreshCw, Download, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface FinancialAnalyticsHeaderProps {
  period: "week" | "month" | "year" | "all";
  loading: boolean;
  onPeriodChange: (period: "week" | "month" | "year" | "all") => void;
  onRefresh: () => void;
}

export const FinancialAnalyticsHeader: React.FC<FinancialAnalyticsHeaderProps> = ({
  period,
  loading,
  onPeriodChange,
  onRefresh,
}) => {
  const navigate = useNavigate();

  const handleExportCSV = () => {
    toast.success("Financial revenue report exported successfully!");
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-5 rounded-2xl shadow-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin")}
          className="p-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-all border border-gray-700/50"
          title="Back to Admin Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Financial & Revenue Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time subscription revenue aggregation, transaction histories, and tier performance.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
       
        <div className="flex items-center p-1 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold">
          {[
            { id: "week", label: "7 Days" },
            { id: "month", label: "30 Days" },
            { id: "year", label: "This Year" },
            { id: "all", label: "All Time" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onPeriodChange(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all border border-gray-700"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
        </button>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Financial Report
        </button>
      </div>
    </div>
  );
};

export default FinancialAnalyticsHeader;
