import React from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import TermsHeader from "../components/terms/TermsHeader";
import TermsSidebar from "../components/terms/TermsSidebar";
import TermsContent, { TERMS_SECTIONS } from "../components/terms/TermsContent";

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
     
      <Navbar />

      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        <TermsHeader />

       
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <TermsSidebar sections={TERMS_SECTIONS} />
          <TermsContent />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsPage;
