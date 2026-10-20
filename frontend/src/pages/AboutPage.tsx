import React from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import AboutHero from "../components/about/AboutHero";
import AboutStats from "../components/about/AboutStats";
import AboutTechStack from "../components/about/AboutTechStack";
import AboutTimeline from "../components/about/AboutTimeline";
import AboutValues from "../components/about/AboutValues";
import AboutCtaCard from "../components/about/AboutCtaCard";

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      <Navbar />

    
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <AboutHero />
        <AboutStats />
        <AboutTechStack />
        <AboutTimeline />
        <AboutValues />
        <AboutCtaCard />
      </main>

     
      <Footer />
    </div>
  );
};

export default AboutPage;
