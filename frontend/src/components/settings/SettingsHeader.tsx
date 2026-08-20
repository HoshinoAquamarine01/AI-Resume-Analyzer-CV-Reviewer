import React from "react";
import { User, Shield, Zap, Bell, Settings } from "lucide-react";

export type SettingsTabType = "profile" | "security" | "subscription" | "notifications";

interface SettingsHeaderProps {
  activeTab: SettingsTabType;
  onTabChange: (tab: SettingsTabType) => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "profile" as SettingsTabType,
      label: "Profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "security" as SettingsTabType,
      label: "Security",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "subscription" as SettingsTabType,
      label: "Subscription",
      icon: <Zap className="w-4 h-4" />,
      badge: "PRO",
    },
    {
      id: "notifications" as SettingsTabType,
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
          <Settings className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personal profile, security credentials, subscription plan, and notification preferences
          </p>
        </div>
      </div>

    
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsHeader;
