import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileSearch, Zap } from "lucide-react";

export const AboutCtaCard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          Start Optimizing Now
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Ready to Beat the ATS & Land Your Dream Job?
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Upload your CV today and receive instant AI feedback, ATS match scores, and customized interview preparation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <FileSearch className="w-4 h-4" />
            <span>Analyze My CV For Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/faq"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors flex items-center justify-center"
          >
            Read FAQ & Help Center
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutCtaCard;
