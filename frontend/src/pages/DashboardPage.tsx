import React from "react";
import MainLayout from "../components/layout/MainLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import QuickActions from "../components/dashboard/QuickActions";
import RecentResumes from "../components/dashboard/RecentResumes";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import UpgradeBanner from "../components/dashboard/UpgradeBanner";

export const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-8 pb-10">
      
        <DashboardHeader />

        
        <StatsGrid />

        <QuickActions />

     
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <RecentResumes />
          </div>
          <div>
            <RecentActivityFeed />
          </div>
        </div>

     
        <UpgradeBanner />
      </div>
    </MainLayout>
  );
};

export default DashboardPage;

