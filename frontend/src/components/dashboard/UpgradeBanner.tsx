import React from "react";
import { Link } from "react-router-dom";
import { Zap, CheckCircle2, ArrowRight } from "lucide-react";

export const UpgradeBanner: React.FC = () => {
  const proFeatures = [
    "Unlimited ATS Diagnostics & Rewriting",
    "Tailored Cover Letters for any vacancy",
    "Targeted STAR Interview Question Drills",
    "Priority Recruiter Parsing Latency (< 2s)",
  ];

  return (
    <div className="saas-card rounded-3xl bg-[#0d1322] border border-slate-800/90 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5 fill-emerald-400/20 text-emerald-400" />
            <span>Accelerate Your Search</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Unlock Full Recruiter-Grade Power with <span className="text-white">CVPulse Pro</span>
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
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-950/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>View Plans & Pricing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpgradeBanner;
