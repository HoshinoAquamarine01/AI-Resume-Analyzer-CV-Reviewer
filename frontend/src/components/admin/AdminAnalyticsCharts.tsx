import React from "react";
import { AdminAnalyticsResponse } from "../../types/admin.types";
import { TrendingUp, Award, FileSpreadsheet, Sparkles } from "lucide-react";

interface AdminAnalyticsChartsProps {
  analytics: AdminAnalyticsResponse | null;
  loading?: boolean;
}

export const AdminAnalyticsCharts: React.FC<AdminAnalyticsChartsProps> = ({ analytics, loading }) => {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse" />
        <div className="h-72 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse" />
      </div>
    );
  }

  const maxUserGrowth = Math.max(...analytics.userGrowth.map((d) => d.count), 1);
  const maxResume = Math.max(...analytics.resumeCreated.map((d) => d.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     
      <div className="lg:col-span-2 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" /> System Growth & Generation Metrics
            </h4>
            <p className="text-xs text-gray-400">Daily new user registrations and AI resume analyze operations</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> User Signups
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> CVs Analyzed
            </span>
          </div>
        </div>

      
        <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-gray-800">
          {analytics.userGrowth.map((item, idx) => {
            const resumeItem = analytics.resumeCreated[idx] || { count: 0 };
            const userHeight = Math.round((item.count / maxUserGrowth) * 100);
            const resumeHeight = Math.round((resumeItem.count / maxResume) * 100);

            return (
              <div key={item._id} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                 
                  <div
                    style={{ height: `${Math.max(userHeight, 8)}%` }}
                    className="w-1/2 max-w-[14px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md group-hover:brightness-125 transition-all relative"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-blue-300 text-[10px] py-0.5 px-1.5 rounded border border-blue-500/30 whitespace-nowrap z-10">
                      +{item.count} users
                    </span>
                  </div>

               
                  <div
                    style={{ height: `${Math.max(resumeHeight, 8)}%` }}
                    className="w-1/2 max-w-[14px] bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md group-hover:brightness-125 transition-all relative"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-purple-300 text-[10px] py-0.5 px-1.5 rounded border border-purple-500/30 whitespace-nowrap z-10">
                      +{resumeItem.count} CVs
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono tracking-tighter">
                  {item._id.split("-").slice(1).join("/")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

     
      <div className="rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 shadow-xl flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Top Power Users
          </h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
            Most Active
          </span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {analytics.topUsers.map((topUser, index) => {
            const userDetails = topUser.userInfo?.[0] || {
              name: `User ${topUser._id.slice(0, 6)}`,
              email: "active.user@domain.com",
            };

            return (
              <div
                key={topUser._id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-800/80 hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      index === 0
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : index === 1
                        ? "bg-gray-300/20 text-gray-300 border border-gray-400/40"
                        : index === 2
                        ? "bg-amber-700/20 text-amber-600 border border-amber-700/40"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{userDetails.name}</p>
                    <p className="text-xs text-gray-400 font-mono truncate max-w-[140px]">{userDetails.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                    <Sparkles className="w-3 h-3" />
                    {topUser.count} CVs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsCharts;
