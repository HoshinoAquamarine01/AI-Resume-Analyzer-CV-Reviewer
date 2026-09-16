import React from "react";
import { Link } from "react-router-dom";
import { Zap, CheckCircle2, ArrowRight } from "lucide-react";

export const UpgradeBanner: React.FC = () => {
  const proFeatures = [
    "Unlimited ATS Rescore & Rewriting",
    "Tailored Cover Letters for any JD",
    "AI Mock Interview Audio Practice",
    "Priority AI Model Latency (< 2s)",
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
   
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            <span>Unlock Premium Career Tools</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Supercharge your job application speed with <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">ResumAI Pro</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
            {proFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            to="/pricing"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Upgrade Now – $9.99/mo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpgradeBanner;
