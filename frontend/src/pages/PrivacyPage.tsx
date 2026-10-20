import React from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import PrivacyHeader from "../components/privacy/PrivacyHeader";
import PrivacySidebar from "../components/privacy/PrivacySidebar";
import PrivacyContent, { PRIVACY_SECTIONS } from "../components/privacy/PrivacyContent";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <PrivacyHeader />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <PrivacySidebar sections={PRIVACY_SECTIONS} />
          <PrivacyContent />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
