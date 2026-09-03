import React from "react";
import { Info, Target, Zap } from "lucide-react";

export const AboutHero: React.FC = () => {
  return (
    <div className="relative text-center max-w-4xl mx-auto mb-20">
     
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

     
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
        <Info className="w-3.5 h-3.5" />
        <span>About CVPulse</span>
      </div>

    
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
        Empowering Job Seekers to <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
          Conquer ATS Filters with AI
        </span>
      </h1>

      
      <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
        CVPulse was created with a clear mission: level the playing field for candidates by giving them access to the same advanced AI parsing & ATS matching technology used by top global recruiters.
      </p>
    </div>
  );
};

export default AboutHero;
