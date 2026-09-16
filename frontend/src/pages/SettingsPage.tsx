import React, { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import SettingsHeader, { SettingsTabType } from "../components/settings/SettingsHeader";
import ProfileTab from "../components/settings/ProfileTab";
import SecurityTab from "../components/settings/SecurityTab";
import SubscriptionTab from "../components/settings/SubscriptionTab";
import NotificationsTab from "../components/settings/NotificationsTab";
import DangerZone from "../components/settings/DangerZone";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>("profile");

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header & Tab Bar */}
        <SettingsHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "subscription" && <SubscriptionTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>

        {/* Danger Zone */}
        <DangerZone />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SettingsPage;
