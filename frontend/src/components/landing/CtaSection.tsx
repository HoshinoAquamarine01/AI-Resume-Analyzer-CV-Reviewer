import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Target, Award } from "lucide-react";

export const CtaSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#090d16] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="saas-card rounded-3xl p-8 sm:p-16 text-center border border-slate-800 bg-[#0d1322] shadow-2xl space-y-8 relative overflow-hidden">
          
          {/* Subtle top accent border line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs sm:text-sm font-semibold">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Accelerate Your Career Today</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Ready to pass the ATS filter and <br className="hidden sm:inline" />
            <span className="saas-highlight-emerald">land your next top role?</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Join over 45,000 developers, product managers, and leaders who transformed their resumes into interview magnet portfolios.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl shadow-xl shadow-emerald-950/50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              <span>Scan My Resume Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free Diagnostic Included</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Private & Never Shared</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CtaSection;
