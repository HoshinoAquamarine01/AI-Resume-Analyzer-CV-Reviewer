import React from "react";
import { ShieldCheck, Clock, FileText } from "lucide-react";

export const TermsHeader: React.FC = () => {
  return (
    <div className="relative text-center max-w-3xl mx-auto mb-12 sm:mb-16">
    
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

    
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-blue-400" />
        <span>Legal Documentation</span>
      </div>

      
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
        Terms of{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
          Service
        </span>
      </h1>

      
      <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-6">
        Please read these Terms of Service carefully before using the ResumAI / CVPulse platform.
        These terms govern your access to and use of our AI-powered resume analysis services.
      </p>

     
      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Updated: September 2026</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Version 2.4</span>
        </div>
      </div>
    </div>
  );
};

export default TermsHeader;
