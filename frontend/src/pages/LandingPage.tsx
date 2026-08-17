import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import AiAnalysisPreview from "../components/landing/AiAnalysisPreview";
import CtaSection from "../components/landing/CtaSection";
import Footer from "../components/landing/Footer";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Features Section */}
      <Features />

      {/* 4. How It Works Section */}
      <HowItWorks />

      {/* 5. AI Analysis Preview Section */}
      <AiAnalysisPreview />

      {/* 6. Main Call-to-Action Section */}
      <CtaSection />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
