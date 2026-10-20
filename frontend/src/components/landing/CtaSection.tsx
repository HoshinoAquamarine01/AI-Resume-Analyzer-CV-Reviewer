import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Target } from "lucide-react";

export const CtaSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      
      <div className="glow-effect w-[500px] h-[500px] bg-emerald-950/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-1 rounded-3xl bg-slate-800 border border-slate-700/80 shadow-2xl">
          <div className="glass-panel rounded-[22px] p-8 sm:p-16 text-center border border-slate-800 space-y-8">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs sm:text-sm font-semibold">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Start Optimizing Your Career Today</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
              Ready to Land <span className="text-gradient">3x More Interviews</span>?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Join 50,000+ engineers, product managers, and professionals getting hired at top global tech & enterprise companies.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-xl shadow-xl shadow-emerald-950/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3 Free Audits Included</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-slate-300" />
                <span>Encrypted Document Parser</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
